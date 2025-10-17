// POST /api/v1/subscriptions/webhook
// Handles Stripe webhook events

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/features/subscriptions/lib/stripe-server';
import { sendToN8n } from '@/lib/utils/n8n-webhook';
import { logger } from '@/lib/utils/logger';
import { ValidationError, NotFoundError } from '@/lib/utils/errors';
import type { N8nWebhookPayload } from '@/features/subscriptions/types/stripe';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let eventId = 'unknown';
  let eventType = 'unknown';
  
  try {
    // Get raw body and signature
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      logger.warn('Webhook signature missing', {
        endpoint: '/api/v1/subscriptions/webhook',
      });
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }
    
    if (!webhookSecret) {
      logger.fatal('Webhook secret not configured', {
        endpoint: '/api/v1/subscriptions/webhook',
      });
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
      eventId = event.id;
      eventType = event.type;
    } catch (error) {
      logger.error('Webhook signature verification failed', {
        endpoint: '/api/v1/subscriptions/webhook',
      }, error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    logger.info(`Received Stripe webhook: ${eventType}`, {
      endpoint: '/api/v1/subscriptions/webhook',
      eventId,
      eventType,
    });
    
    const supabase = await createClient();
    
    // Check for duplicate events (idempotency)
    const { data: existingEvent, error: checkError } = await supabase
      .from('subscription_events')
      .select('id, processed')
      .eq('stripe_event_id', eventId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      logger.error('Failed to check for duplicate event', {
        eventId,
        eventType,
      }, checkError);
      // Continue processing anyway - better to process twice than not at all
    }
    
    if (existingEvent) {
      logger.info(`Event ${eventId} already processed, skipping`, {
        eventId,
        eventType,
        processed: existingEvent.processed,
      });
      return NextResponse.json({ 
        received: true, 
        duplicate: true,
        processed: existingEvent.processed,
      }, { status: 200 });
    }
    
    // Log event to database
    const { error: insertError } = await supabase.from('subscription_events').insert({
      stripe_event_id: eventId,
      event_type: eventType,
      event_source: 'stripe',
      metadata: event.data.object as any,
      processed: false,
    });
    
    if (insertError) {
      logger.error('Failed to log webhook event', {
        eventId,
        eventType,
      }, insertError);
      // Continue processing - logging failure shouldn't prevent processing
    }
    
    // Handle different event types
    let processed = false;
    let error: string | null = null;
    
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event, supabase);
          processed = true;
          break;
        
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event, supabase);
          processed = true;
          break;
        
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event, supabase);
          processed = true;
          break;
        
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event, supabase);
          processed = true;
          break;
        
        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event, supabase);
          processed = true;
          break;
        
        case 'invoice.payment_failed':
          await handlePaymentFailed(event, supabase);
          processed = true;
          break;
        
        case 'customer.subscription.trial_will_end':
          await handleTrialWillEnd(event, supabase);
          processed = true;
          break;
        
        default:
          logger.debug(`Unhandled event type: ${event.type}`, {
            eventId,
            eventType,
          });
          processed = true; // Mark as processed even if we don't handle it
      }
      
      logger.info(`Successfully processed webhook: ${eventType}`, {
        eventId,
        eventType,
        duration: `${Date.now() - startTime}ms`,
      });
      
    } catch (err) {
      logger.error(`Error handling webhook ${eventType}`, {
        eventId,
        eventType,
        duration: `${Date.now() - startTime}ms`,
      }, err);
      
      error = err instanceof Error ? err.message : 'Unknown error';
      processed = false;
      
      // For critical errors, we should retry (return 500)
      // For validation errors, mark as processed but log error
      if (err instanceof ValidationError || err instanceof NotFoundError) {
        processed = true; // Don't retry validation errors
      }
    }
    
    // Update event processing status
    const { error: updateError } = await supabase
      .from('subscription_events')
      .update({
        processed,
        processed_at: new Date().toISOString(),
        error,
      })
      .eq('stripe_event_id', eventId);
    
    if (updateError) {
      logger.error('Failed to update event status', {
        eventId,
        eventType,
      }, updateError);
    }
    
    // Return appropriate status code
    if (!processed && !error) {
      // Processing was skipped but no error - success
      return NextResponse.json({ received: true }, { status: 200 });
    }
    
    if (!processed && error) {
      // Processing failed - Stripe will retry
      logger.warn('Webhook processing failed, will retry', {
        eventId,
        eventType,
        error,
      });
      return NextResponse.json({ 
        error: 'Processing failed',
        eventId,
        willRetry: true,
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      received: true,
      eventId,
      eventType,
    }, { status: 200 });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.fatal('Webhook handler crashed', {
      endpoint: '/api/v1/subscriptions/webhook',
      eventId,
      eventType,
      duration: `${duration}ms`,
    }, error);
    
    return NextResponse.json({ 
      error: 'Webhook handler failed',
      eventId,
    }, { status: 500 });
  }
}

// Event handlers

async function handleCheckoutSessionCompleted(event: Stripe.Event, supabase: any) {
  const session = event.data.object as Stripe.Checkout.Session;
  
  const userId = session.metadata?.userId;
  const tierId = session.metadata?.tierId;
  const billingCycle = session.metadata?.billingCycle as 'monthly' | 'annual';
  
  if (!userId || !tierId) {
    console.error('Missing metadata in checkout session');
    return;
  }
  
  console.log(`✅ Checkout completed for user ${userId}, tier ${tierId}`);
  
  // Update user subscription
  const subscriptionData: any = {
    tier_id: tierId,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    billing_cycle: billingCycle,
    status: 'active',
  };
  
  // Set trial dates if subscription has trial
  if (session.subscription) {
    const { stripe } = await import('@/features/subscriptions/lib/stripe-server');
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    if (subscription.trial_start && subscription.trial_end) {
      subscriptionData.trial_start = new Date(subscription.trial_start * 1000).toISOString();
      subscriptionData.trial_end = new Date(subscription.trial_end * 1000).toISOString();
      subscriptionData.status = 'trialing';
    }
    
    if ((subscription as any).current_period_start && (subscription as any).current_period_end) {
      subscriptionData.current_period_start = new Date((subscription as any).current_period_start * 1000).toISOString();
      subscriptionData.current_period_end = new Date((subscription as any).current_period_end * 1000).toISOString();
    }
  }
  
  await supabase
    .from('user_subscriptions')
    .update(subscriptionData)
    .eq('user_id', userId);
  
  // Send to n8n
  await sendSubscriptionEventToN8n(userId, 'subscription.created', supabase);
}

async function handleSubscriptionCreated(event: Stripe.Event, supabase: any) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`✅ Subscription created: ${subscription.id}`);
  
  // Usually handled by checkout.session.completed, but update if needed
  await updateSubscriptionFromStripe(subscription, supabase);
}

async function handleSubscriptionUpdated(event: Stripe.Event, supabase: any) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`✅ Subscription updated: ${subscription.id}`);
  
  await updateSubscriptionFromStripe(subscription, supabase);
  
  // Find user and send to n8n
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (userSub) {
    await sendSubscriptionEventToN8n(userSub.user_id, 'subscription.updated', supabase);
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event, supabase: any) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`✅ Subscription cancelled: ${subscription.id}`);
  
  // Find user subscription and move to free tier
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (userSub) {
    // Get free tier ID
    const { data: freeTier } = await supabase
      .from('subscription_tiers')
      .select('id')
      .eq('name', 'free')
      .single();
    
    if (freeTier) {
      await supabase
        .from('user_subscriptions')
        .update({
          tier_id: freeTier.id,
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          stripe_subscription_id: null,
          stripe_price_id: null,
        })
        .eq('user_id', userSub.user_id);
      
      await sendSubscriptionEventToN8n(userSub.user_id, 'subscription.cancelled', supabase);
    }
  }
}

async function handlePaymentSucceeded(event: Stripe.Event, supabase: any) {
  const invoice = event.data.object as any;
  console.log(`✅ Payment succeeded: ${invoice.id}`);
  
  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
  
  if (subscriptionId) {
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();
    
    if (userSub) {
      await sendSubscriptionEventToN8n(userSub.user_id, 'payment.succeeded', supabase);
    }
  }
}

async function handlePaymentFailed(event: Stripe.Event, supabase: any) {
  const invoice = event.data.object as any;
  console.log(`❌ Payment failed: ${invoice.id}`);
  
  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
  
  if (subscriptionId) {
    // Update subscription status
    await supabase
      .from('user_subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', subscriptionId);
    
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();
    
    if (userSub) {
      await sendSubscriptionEventToN8n(userSub.user_id, 'payment.failed', supabase);
    }
  }
}

async function handleTrialWillEnd(event: Stripe.Event, supabase: any) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`⏰ Trial ending soon: ${subscription.id}`);
  
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (userSub) {
    await sendSubscriptionEventToN8n(userSub.user_id, 'trial.ending', supabase);
  }
}

// Helper function to update subscription from Stripe data
async function updateSubscriptionFromStripe(subscription: Stripe.Subscription, supabase: any) {
  const sub = subscription as any;
  const updateData: any = {
    status: sub.status,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end || false,
  };
  
  if (sub.canceled_at) {
    updateData.cancelled_at = new Date(sub.canceled_at * 1000).toISOString();
  }
  
  await supabase
    .from('user_subscriptions')
    .update(updateData)
    .eq('stripe_subscription_id', sub.id);
}

// Helper function to send events to n8n
async function sendSubscriptionEventToN8n(userId: string, eventType: string, supabase: any) {
  try {
    // Get user and subscription details
    const { data: user } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('id', userId)
      .single();
    
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        tier:subscription_tiers(name, price_monthly_pence, price_annual_pence)
      `)
      .eq('user_id', userId)
      .single();
    
    if (!user || !subscription) {
      console.error('Could not find user or subscription for n8n webhook');
      return;
    }
    
    const tier = (subscription as any).tier;
    
    // Calculate amount
    let amountGbp = 0;
    if (subscription.billing_cycle === 'monthly') {
      amountGbp = tier.price_monthly_pence / 100;
    } else if (subscription.billing_cycle === 'annual') {
      amountGbp = tier.price_annual_pence / 100;
    }
    
    // Calculate trial days remaining
    let trialDaysRemaining = 0;
    if (subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end);
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    
    const payload: N8nWebhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      user: {
        id: userId,
        email: user.email || '',
        name: user.display_name || null,
      },
      subscription: {
        id: subscription.id,
        tier: tier.name,
        billingCycle: subscription.billing_cycle || 'monthly',
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end || '',
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      payment: {
        amountGbp,
        currency: 'GBP',
        stripeCustomerId: subscription.stripe_customer_id || '',
        stripeSubscriptionId: subscription.stripe_subscription_id || '',
      },
      trial: {
        active: !!subscription.trial_end && new Date(subscription.trial_end) > new Date(),
        daysRemaining: trialDaysRemaining,
      },
    };
    
    await sendToN8n(payload);
  } catch (error) {
    console.error('Error sending to n8n:', error);
  }
}
