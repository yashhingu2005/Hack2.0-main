import { useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inDoctorGroup = segments[0] === '(doctor)';
    const inPatientGroup = segments[0] === '(patient)';
    const inAuthScreens = segments[0] === undefined || segments[0] === 'login';
    const inProtectedRoutes = inDoctorGroup || inPatientGroup;

    if (!isAuthenticated && inProtectedRoutes) {
      // User is not authenticated but trying to access protected routes
      router.replace('/');
    } else if (isAuthenticated && user) {
      if (inAuthScreens) {
        // User is authenticated but on auth screens - redirect to appropriate dashboard
        if (user.role === 'doctor') {
          router.replace('/(doctor)/appointments');
        } else if (user.role === 'patient') {
          router.replace('/(patient)/today');
        }
      } else if (user.role === 'doctor' && inPatientGroup) {
        // Doctor trying to access patient routes
        router.replace('/(doctor)/appointments');
      } else if (user.role === 'patient' && inDoctorGroup) {
        // Patient trying to access doctor routes
        router.replace('/(patient)/today');
      } else if (user.role === 'patient' && inPatientGroup) {
        // Prevent direct access to SOS and Onboarding for patients
        const currentPath = segments.join('/');
        if (currentPath.includes('sos') || currentPath.includes('onboarding')) {
          router.replace('/(patient)/today');
        }
      }
    }
  }, [isAuthenticated, user, segments, isLoading]);

  return <>{children}</>;
}