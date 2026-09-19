import AuthForm from '@/components/AuthForm';

const SignUp = async () => {
  return (
    <section className="size-full md:flex md:items-center md:justify-center md:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
