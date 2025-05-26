import { DnaIcon } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex gap-2 items-center justify-center pb-2 border-b">
      <DnaIcon /> <div className="text-2xl font-semibold">GeneIP</div>
    </div>
  );
};

export default Logo;
