export function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />
    </div>
  )
}

