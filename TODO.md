# TODO: Implement Post-Signup Onboarding Check

## Tasks
- [x] Add `checkPatientOnboardingComplete` function in `contexts/AuthContext.tsx` to check both `profile_completed` and `medical_history_completed` flags
- [x] Modify `handleSignup` in `app/signup.tsx` to check onboarding status after signup and redirect accordingly
- [ ] Test the signup flow for patients to ensure onboarding launches when flags are false
- [ ] Test the signup flow for doctors to ensure no changes in behavior

## Details
- After signup, if user is patient and both profile_completed and medical_history_completed are false, redirect to onboarding page
- Otherwise, redirect to login page
- Doctors should not be affected by this change
