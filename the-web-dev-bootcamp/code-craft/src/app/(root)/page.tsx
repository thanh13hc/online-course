import EditorPanel from "@/app/(root)/_components/EditorPanel";
import Header from "@/app/(root)/_components/Header";
import OutputPanel from "@/app/(root)/_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] max-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
