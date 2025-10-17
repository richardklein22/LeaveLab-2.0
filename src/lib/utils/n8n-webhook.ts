// n8n webhook utility
import type { N8nWebhookPayload } from '@/features/subscriptions/types/stripe';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Send event data to n8n webhook
 */
export async function sendToN8n(
  payload: N8nWebhookPayload
): Promise<{ success: boolean; error?: string }> {
  if (!N8N_WEBHOOK_URL) {
    console.warn('N8N_WEBHOOK_URL not configured, skipping webhook');
    return { success: false, error: 'N8N_WEBHOOK_URL not configured' };
  }
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`n8n webhook returned ${response.status}: ${response.statusText}`);
      }
      
      console.log(`✅ Sent ${payload.event} event to n8n`);
      return { success: true };
      
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ n8n webhook attempt ${attempt}/${MAX_RETRIES} failed:`, error);
      
      // Don't retry on final attempt
      if (attempt < MAX_RETRIES) {
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return {
    success: false,
    error: lastError?.message || 'Unknown error sending to n8n',
  };
}

/**
 * Log n8n webhook result to database
 */
export async function logN8nWebhook(
  userId: string,
  eventType: string,
  payload: N8nWebhookPayload,
  result: { success: boolean; error?: string }
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: `n8n.${eventType}`,
    event_source: 'n8n',
    metadata: {
      payload,
      result,
    },
    processed: result.success,
    error: result.error || null,
  });
}

