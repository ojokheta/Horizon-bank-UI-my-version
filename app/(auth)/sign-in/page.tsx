import AuthForm from '@/components/AuthForm';

const SignIn = () => {
  return (
    <section className="size-full md:flex md:items-center md:justify-center md:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
