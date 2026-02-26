import * as React from 'react'
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

          <View className="flex-1 px-6">
            <View className="flex-1 justify-center ">
              {/* Logo branding */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                  <Ionicons name="fitness" size={40} color="white" />
                </View>
                <Text className="text-3xl text-gray-600 text-center">
                  Check Your Email
                </Text>
                <Text className="text-lg text-gray-600 text-center">
                  Please enter the verification code sent to {emailAddress}.
                </Text>
                </View>
                 {/* Verification form */}
                 <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Verify Your Account
                    </Text>
                  </View> 

                  {/*Code input and verify button*/}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                          Verification Code
                        </Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                          <Ionicons name="key-outline" size={20} color="#6B7280" />
                          <TextInput
                            value={code}
                            placeholder="Enter verification code"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(code) => setCode(code)}
                            className="border border-gray-900 flex-1 ml-3 text-center text-lg tracking-widest"
                            keyboardType='number-pad'
                            maxLength={6}
                            editable={!isLoading}
                          />
                        </View>
                        </View>
                        <TouchableOpacity
                          onPress={onVerifyPress}
                          disabled={isLoading}
                          className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
                          activeOpacity={0.8}
                        >
                          <View className="flex-row items-center justify-center">
                            {isLoading ? (
                              <Ionicons name="refresh" size={20} color="white" />
                            ) : (
                              <Ionicons name="checkmark-done-outline" size={20} color="white" />
                            )}
                            <Text className="text-white font-semibold text-lg ml-2">
                              {isLoading ? "Verifying..." : "Verify"}
                            </Text>
                          </View>
                        </TouchableOpacity>

                      {/* Resend code link */}
                      <TouchableOpacity className="py-2">
                        <Text className="text-blue-600 font-medium text-center">
                          Didn't receive a code? Resend
                        </Text>
                      </TouchableOpacity>
            </View>
          </View>
          {/* Footer */}
          <View className="pb-6">
            <Text className="text-center text-ms text-gray-500">
              Need help? Contact our support team.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
         

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

       <View className='flex-1 px-6'>
        {/* Main*/}
          <View className='flex-1 justify-center'>
          {/* Logo branding */}
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name = "fitness" size={40} color="white"/>
              </View>
              <Text className='text-3xl text-gray-600 text-center'>Join FitTracker</Text>
              <Text className='text-lg text-gray-600 text-center'>Start Your fitness journey {"\n"} and achieve your goals with us!
              </Text>
          </View>

          {/* Sign-up form */}
          <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold  text-gray-900 mb-6 text-center'>
                Create an account
                </Text>

                {/* Email input */}
                <View className='mb-4'>
                  <Text className='text-sm font-medium
                  text-gray-700 mb-2'>Email Address</Text>
                  <View  className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons className="mail-outline" size={20} color="#6B7280"/>
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={(email) => setEmailAddress(email)}
                    className='border border-gray-900 flex-1 ml-3'
                    editable={!isLoading}
                    />
                </View>
            </View>

            {/*Password input*/}
            <View className='mb-6'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>Password</Text>
              <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
              <Ionicons className="lock-closed-outline" size={20} color="#6B7280"/>
              <TextInput
                autoCapitalize="none"
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                className='border border-gray-900 flex-1 ml-3'
                editable={!isLoading}
              />
            </View>
            <Text className='text-center text-xs text-gray-500 mt-1'>
              Must be atleast 8 characters. Include a number and a symbol.
            </Text>
        </View>

        {/*Sign-up button*/}
          <TouchableOpacity
          onPress={onSignUpPress} 
          disabled={isLoading}
          className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
            activeOpacity = {0.8}>
              <View className='flex-row items-center justify-center0'>
                {isLoading ? (
                  <Ionicons name = "refresh" size={20} color = "white"/>):(
                    <Ionicons name = "person-add-outline" size={20} color = "white"/>
                  )}
                  <Text className='text-white font-semibold text-lg ml-2' >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Text>
              </View>
          </TouchableOpacity>

          {/*Terms and conditions*/}
          <Text className='text-center text-xs text-gray-500 mb-4'>
            By signing up, you agree to our {" "}
            <Text className='text-blue-600'>Terms of Service</Text> and {" "}
            <Text className='text-blue-600'>Privacy Policy</Text>.
          </Text>
          </View>

          {/*Sign-in link*/}
            <View className='flex-row items-center justify-center gap-2'>
              <Text className='text-sm text-gray-600'>Already have an account?</Text>
              <Link href="/sign-in" asChild >
              <TouchableOpacity>
                <Text className='text-blue-600 font-semibold'>Sign in</Text>
              </TouchableOpacity>
              </Link>
          </View>
          </View>
                  
        {/*Footer*/}
        <View className='pb-6'>
            <Text className='text-center text-ms text-gray-500'>  
              Ready to transform your fitness?
            </Text>
        </View>
       </View> 
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}