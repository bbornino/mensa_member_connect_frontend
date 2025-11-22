/**
 * Google Analytics event tracking utility
 * 
 * This utility provides a type-safe way to track events in Google Analytics.
 * It checks if gtag is available before sending events to prevent errors.
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
      }
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event in Google Analytics
 * 
 * @param eventName - The name of the event (e.g., 'user_registration', 'connection_request')
 * @param eventParams - Optional parameters to send with the event
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    [key: string]: string | number | boolean | undefined;
  }
): void {
  // Check if gtag is available (it should be loaded from index.html)
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, {
        ...eventParams,
        // Add timestamp for debugging
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Silently fail in production, but log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('GA event tracking failed:', error);
      }
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('Google Analytics (gtag) is not available');
  }
}

/**
 * Predefined event tracking functions for common actions
 */
export const analytics = {
  /**
   * Track user registration
   */
  trackRegistration: (success: boolean, error?: string) => {
    trackEvent('user_registration', {
      success,
      ...(error && { error_message: error }),
    });
  },

  /**
   * Track user login
   */
  trackLogin: (success: boolean, error?: string) => {
    trackEvent('user_login', {
      success,
      ...(error && { error_message: error }),
    });
  },

  /**
   * Track user logout
   */
  trackLogout: () => {
    trackEvent('user_logout');
  },

  /**
   * Track connection request sent
   */
  trackConnectionRequest: (expertId: number, contactMethod?: string) => {
    trackEvent('connection_request', {
      expert_id: expertId,
      ...(contactMethod && { contact_method: contactMethod }),
    });
  },

  /**
   * Track profile update
   */
  trackProfileUpdate: (profileType: 'member' | 'expert', success: boolean) => {
    trackEvent('profile_update', {
      profile_type: profileType,
      success,
    });
  },

  /**
   * Track password reset request
   */
  trackPasswordResetRequest: (success: boolean) => {
    trackEvent('password_reset_request', {
      success,
    });
  },

  /**
   * Track password reset confirmation (when user actually resets password)
   */
  trackPasswordResetConfirm: (success: boolean) => {
    trackEvent('password_reset_confirm', {
      success,
    });
  },

  /**
   * Track expert profile creation/update
   */
  trackExpertProfileUpdate: (action: 'create' | 'update', success: boolean) => {
    trackEvent('expert_profile_update', {
      action,
      success,
    });
  },
};

