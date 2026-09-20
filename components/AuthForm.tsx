'use client';
import AuthDoodle from '@/components/AuthDoodle';
import CustomInput from './CustomInput';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signIn, signUp } from '@/lib/actions/user.actions';
import { authFormSchema, cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'reicon-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === 'sign-in';

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === 'sign-up') {
        const newUser = await signUp(data);
        if (newUser) router.push('/');
      }
      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="auth-shell w-full"
      >
        <div className="relative h-[30vh] min-h-[190px] bg-forest md:hidden">
          <AuthDoodle />
        </div>

        <section
          className={cn(
            'relative -mt-16 rounded-tl-[5.5rem] bg-background px-7 pb-10 pt-16 dark:bg-card',
            'md:mt-0 md:flex md:min-h-[100dvh] md:max-w-[420px] md:flex-col md:justify-center md:gap-8 md:rounded-none md:bg-transparent md:px-5 md:py-16 md:dark:bg-transparent'
          )}
        >
          <div className="absolute left-1/2 top-0 flex size-[4.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.35rem] bg-white shadow-[0_10px_30px_rgba(16,24,40,0.16)] md:hidden">
            <Logo size={46} />
          </div>

          <header className="hidden flex-col gap-8 md:flex">
            <Link href="/" className="flex cursor-pointer items-center gap-2">
              <Logo size={40} />
              <h1 className="text-26 font-ibm-plex-serif font-bold text-forest dark:text-sage">
                Horizon
              </h1>
            </Link>
            <div>
              <h1 className="text-24 font-semibold text-foreground lg:text-36">
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </h1>
              <p className="text-16 font-normal text-muted-foreground">
                Please enter your details
              </p>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[360px] md:mx-0 md:max-w-none">
            <h1 className="text-center text-[2.75rem] font-bold leading-none tracking-tight text-foreground md:hidden">
              {isSignIn ? 'Login' : 'Sign Up'}
            </h1>
            <p className="mt-4 text-center text-sm text-muted-foreground md:hidden">
              {isSignIn ? 'Welcome Back!' : 'Create your Horizon account'}
            </p>

            <div className="mt-8 space-y-4 md:mt-8 md:space-y-6">
              {type === 'sign-up' ? (
                <>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Olumide"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Adebayo"
                    />
                  </div>
                  <div className="hidden space-y-6 md:block">
                    <CustomInput
                      control={form.control}
                      name="address1"
                      label="Address"
                      placeholder="Enter your specific address"
                    />
                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="Enter your city"
                    />
                    <div className="flex gap-4">
                      <CustomInput
                        control={form.control}
                        name="state"
                        label="State"
                        placeholder="Example: LA"
                      />
                      <CustomInput
                        control={form.control}
                        name="postalCode"
                        label="Postal Code"
                        placeholder="Example: 100001"
                      />
                    </div>
                    <div className="flex gap-4">
                      <CustomInput
                        control={form.control}
                        name="dateOfBirth"
                        label="Date of Birth"
                        placeholder="YYYY-MM-DD"
                      />
                      <CustomInput
                        control={form.control}
                        name="ssn"
                        label="NIN"
                        placeholder="Example: 1234"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <CustomInput
                control={form.control}
                name="email"
                label={
                  <>
                    <span className="md:hidden">With email</span>
                    <span className="hidden md:inline">Email</span>
                  </>
                }
                placeholder="hello@reallygreatsite.com"
              />
              <CustomInput
                control={form.control}
                name="password"
                label={
                  <>
                    <span className="md:hidden">With password</span>
                    <span className="hidden md:inline">Password</span>
                  </>
                }
                placeholder="At least 8 characters"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-5 h-12 w-full rounded-xl bg-muted text-base font-semibold text-foreground hover:bg-forest hover:text-sage md:mt-8 md:bg-primary md:text-primary-foreground md:hover:bg-primary/90 dark:hover:bg-sage dark:hover:text-forest md:dark:hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  &nbsp;Loading...
                </>
              ) : isSignIn ? (
                <span>
                  <span className="md:hidden">Continue</span>
                  <span className="hidden md:inline">Sign In</span>
                </span>
              ) : (
                <span>
                  <span className="md:hidden">Continue</span>
                  <span className="hidden md:inline">Sign Up</span>
                </span>
              )}
            </Button>

            <div className="mt-5 flex items-center justify-between text-xs font-medium text-muted-foreground md:hidden">
              <a href="mailto:hello@horizon.ng">Need help?</a>
              <span>Sign in another way</span>
            </div>

            <footer className="mt-10 flex justify-center gap-1 text-sm md:mt-8">
              <p className="text-muted-foreground">
                {isSignIn
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </p>
              <Link
                href={isSignIn ? '/sign-up' : '/sign-in'}
                className="font-semibold text-foreground md:text-forest md:dark:text-sage"
              >
                {isSignIn ? 'Sign Up' : 'Login'}
              </Link>
            </footer>
          </div>
        </section>
      </form>
    </Form>
  );
};

export default AuthForm;
