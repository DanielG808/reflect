type MainContainerProps = {
  children: React.ReactNode;
};

export default function MainContainer({ children }: MainContainerProps) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}
