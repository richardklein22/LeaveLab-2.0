/**
 * useSubscriptionGate Hook
 * 
 * Content access control based on user's subscription tier.
 * Uses the tier access utilities to check permissions.
 */

'use client';

import { useSubscription } from './useSubscription';
import {
  checkCourseAccess,
  checkCommunityAccess,
  checkVisaInfoAccess,
  checkAccommodationInfoAccess,
  checkSupportLevel,
  canAccessContent,
} from '../lib/tier-access';

export type ContentType = 'course' | 'community' | 'visa_info' | 'accommodation_info' | 'support';
export type ContentLevel = 'short_term' | 'long_term' | 'all';

interface UseSubscriptionGateReturn {
  canAccess: (contentType: ContentType, level?: ContentLevel) => boolean;
  hasAccess: boolean;
  requiredTier: string | null;
  currentTier: string;
  isLoading: boolean;
  supportLevel: 'none' | 'email' | 'one-on-one';
}

/**
 * Hook to check content access based on subscription tier
 * 
 * @example
 * ```tsx
 * function CourseContent({ courseId }) {
 *   const { canAccess, hasAccess, requiredTier } = useSubscriptionGate('course');
 *   
 *   if (!hasAccess) {
 *     return <UpgradePrompt requiredTier={requiredTier} />;
 *   }
 *   
 *   return <Course id={courseId} />;
 * }
 * ```
 */
export function useSubscriptionGate(
  contentType: ContentType,
  level?: ContentLevel
): UseSubscriptionGateReturn {
  const { subscription, isLoading } = useSubscription();

  // Convert API format (camelCase) to database format (snake_case) for access functions
  const apiFeatures = subscription?.tier.features;
  const tierFeatures = apiFeatures ? {
    max_courses: apiFeatures.maxCourses,
    first_lesson_only: apiFeatures.firstLessonOnly,
    community_access: apiFeatures.communityAccess,
    email_support: apiFeatures.emailSupport,
    one_on_one_support: apiFeatures.oneOnOneSupport,
    visa_info: apiFeatures.visaInfo,
    accommodation_info: apiFeatures.accommodationInfo,
    has_trial: false,
    trial_days: null,
  } : {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  };

  const currentTier = subscription?.tier.displayName || 'Free';

  // Check access based on content type
  let hasAccess = false;
  let requiredTier: string | null = null;

  switch (contentType) {
    case 'course':
      hasAccess = checkCourseAccess(tierFeatures);
      if (!hasAccess) requiredTier = 'Basic';
      break;

    case 'community':
      hasAccess = checkCommunityAccess(tierFeatures);
      if (!hasAccess) requiredTier = 'Basic';
      break;

    case 'visa_info':
      hasAccess = checkVisaInfoAccess(tierFeatures, level);
      if (!hasAccess) {
        requiredTier = level === 'long_term' ? 'Premium' : 'Basic';
      }
      break;

    case 'accommodation_info':
      hasAccess = checkAccommodationInfoAccess(tierFeatures, level);
      if (!hasAccess) {
        requiredTier = level === 'long_term' ? 'Premium' : 'Basic';
      }
      break;

    case 'support':
      hasAccess = checkSupportLevel(tierFeatures) !== 'none';
      if (!hasAccess) requiredTier = 'Basic';
      break;

    default:
      hasAccess = false;
      requiredTier = 'Basic';
  }

  const canAccessFn = (type: ContentType, lvl?: ContentLevel) => {
    // Map 'support' to email_support for the tier-access function
    const mappedType = type === 'support' ? ('email_support' as any) : type;
    return canAccessContent(tierFeatures, mappedType as any, lvl);
  };

  return {
    canAccess: canAccessFn,
    hasAccess,
    requiredTier,
    currentTier,
    isLoading,
    supportLevel: checkSupportLevel(tierFeatures),
  };
}

/**
 * Helper hook to check if user can access a specific course
 * 
 * @example
 * ```tsx
 * function CourseCard({ courseId }) {
 *   const { canAccess, requiredTier } = useCourseAccess(courseId);
 *   
 *   return (
 *     <Card>
 *       {!canAccess && <Badge>Requires {requiredTier}</Badge>}
 *       <CourseDetails id={courseId} locked={!canAccess} />
 *     </Card>
 *   );
 * }
 * ```
 */
export function useCourseAccess(courseId?: string) {
  const { subscription } = useSubscription();
  
  const apiFeatures = subscription?.tier.features;
  const tierFeatures = apiFeatures ? {
    max_courses: apiFeatures.maxCourses,
    first_lesson_only: apiFeatures.firstLessonOnly,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  } : {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  };

  const canAccess = checkCourseAccess(tierFeatures, courseId);
  const requiredTier = canAccess ? null : 'Basic';

  return {
    canAccess,
    requiredTier,
    courseLimit: tierFeatures.max_courses || 0,
  };
}

/**
 * Helper hook to check community access
 */
export function useCommunityAccess() {
  const { subscription } = useSubscription();
  
  const apiFeatures = subscription?.tier.features;
  const tierFeatures = apiFeatures ? {
    max_courses: 0,
    first_lesson_only: true,
    community_access: apiFeatures.communityAccess,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  } : {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  };

  const canAccess = checkCommunityAccess(tierFeatures);
  const requiredTier = canAccess ? null : 'Basic';

  return {
    canAccess,
    requiredTier,
  };
}

/**
 * Helper hook to check visa info access by level
 */
export function useVisaInfoAccess(level?: ContentLevel) {
  const { subscription } = useSubscription();
  
  const apiFeatures = subscription?.tier.features;
  const tierFeatures = apiFeatures ? {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: apiFeatures.visaInfo,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  } : {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  };

  const canAccess = checkVisaInfoAccess(tierFeatures, level);
  const requiredTier = canAccess ? null : (level === 'long_term' ? 'Premium' : 'Basic');

  return {
    canAccess,
    requiredTier,
    availableLevel: tierFeatures.visa_info || 'none',
  };
}

/**
 * Helper hook to check accommodation info access by level
 */
export function useAccommodationInfoAccess(level?: ContentLevel) {
  const { subscription } = useSubscription();
  
  const apiFeatures = subscription?.tier.features;
  const tierFeatures = apiFeatures ? {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: apiFeatures.accommodationInfo,
    has_trial: false,
    trial_days: null,
  } : {
    max_courses: 0,
    first_lesson_only: true,
    community_access: false,
    email_support: false,
    one_on_one_support: false,
    visa_info: 'none' as const,
    accommodation_info: 'none' as const,
    has_trial: false,
    trial_days: null,
  };

  const canAccess = checkAccommodationInfoAccess(tierFeatures, level);
  const requiredTier = canAccess ? null : (level === 'long_term' ? 'Premium' : 'Basic');

  return {
    canAccess,
    requiredTier,
    availableLevel: tierFeatures.accommodation_info || 'none',
  };
}

