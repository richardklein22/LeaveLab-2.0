// Tier access control utility
import type { TierFeatures } from '../types/subscription';

export type ContentType = 
  | 'course'
  | 'community'
  | 'visa_info'
  | 'accommodation_info'
  | 'email_support'
  | 'one_on_one_support';

export type ContentLevel = 'short_term' | 'long_term' | 'all';

/**
 * Check if user can access a course
 */
export function checkCourseAccess(tierFeatures: TierFeatures, courseId?: string): boolean {
  const maxCourses = tierFeatures.max_courses;
  
  // Unlimited courses (Premium)
  if (maxCourses === null) {
    return true;
  }
  
  // First lesson only (Free)
  if (tierFeatures.first_lesson_only) {
    return true; // Can view first lesson
  }
  
  // Limited courses (Basic)
  if (maxCourses > 0) {
    // In a real implementation, we'd check if user has already enrolled in max courses
    // For now, we'll allow access if they have course slots
    return true;
  }
  
  return false;
}

/**
 * Check if user can access community features
 */
export function checkCommunityAccess(tierFeatures: TierFeatures): boolean {
  return tierFeatures.community_access;
}

/**
 * Check if user can access visa information
 */
export function checkVisaInfoAccess(
  tierFeatures: TierFeatures,
  level?: ContentLevel
): boolean {
  const visaInfo = tierFeatures.visa_info;
  
  if (visaInfo === 'none') {
    return false;
  }
  
  if (visaInfo === 'all') {
    return true;
  }
  
  if (visaInfo === 'short_term') {
    // Can access short-term info only
    return level === 'short_term' || !level;
  }
  
  return false;
}

/**
 * Check if user can access accommodation information
 */
export function checkAccommodationInfoAccess(
  tierFeatures: TierFeatures,
  level?: ContentLevel
): boolean {
  const accommodationInfo = tierFeatures.accommodation_info;
  
  if (accommodationInfo === 'none') {
    return false;
  }
  
  if (accommodationInfo === 'all') {
    return true;
  }
  
  if (accommodationInfo === 'short_term') {
    // Can access short-term info only
    return level === 'short_term' || !level;
  }
  
  return false;
}

/**
 * Check support level available to user
 */
export function checkSupportLevel(tierFeatures: TierFeatures): 'none' | 'email' | 'one-on-one' {
  if (tierFeatures.one_on_one_support) {
    return 'one-on-one';
  }
  
  if (tierFeatures.email_support) {
    return 'email';
  }
  
  return 'none';
}

/**
 * General content access check
 */
export function canAccessContent(
  tierFeatures: TierFeatures,
  contentType: ContentType,
  level?: ContentLevel
): boolean {
  switch (contentType) {
    case 'course':
      return checkCourseAccess(tierFeatures);
    
    case 'community':
      return checkCommunityAccess(tierFeatures);
    
    case 'visa_info':
      return checkVisaInfoAccess(tierFeatures, level);
    
    case 'accommodation_info':
      return checkAccommodationInfoAccess(tierFeatures, level);
    
    case 'email_support':
      return tierFeatures.email_support;
    
    case 'one_on_one_support':
      return tierFeatures.one_on_one_support;
    
    default:
      return false;
  }
}

