import Chat from "@/app/Chat";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 bg-slate-200">tree</div>
      <div className="w-[400px]">
        <Chat />
      </div>
    </div>
  );
}
