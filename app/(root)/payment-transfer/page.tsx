import TransferFundsPage from '@/components/TransferFundsPage';

const Transfer = ({
  searchParams,
}: {
  searchParams: { from?: string };
}) => {
  return <TransferFundsPage initialSource={searchParams.from} />;
};

export default Transfer;
