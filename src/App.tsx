import { useEffect, useState } from "react";
import { ValidatorList } from "./ValidatorList";
import { getActiveEra } from "./val.state";
import { Button } from "@/components/ui/button";

function App() {
  const [selectedEra, setSelectedEra] = useState<number | null>(null);

  useEffect(() => {
    const fetchActiveEra = async () => {
      const era = await getActiveEra();
      setSelectedEra(era);
    };
    fetchActiveEra();
  }, []);

  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto mt-8">
        {selectedEra === null ? (
          <div className="text-center text-lg font-semibold">
            🤓 Loading active era...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <h1 className="font-bold text-2xl text-center w-full">
                Compare Best Performing Validators 🤩 who yield the highest APY of Chosen Era
              </h1>
              <div className="ml-auto">
                <Button>Wallet</Button>
              </div>
            </div>

            <div className="border p-4">
              <ValidatorList selectedEra={selectedEra} setSelectedEra={setSelectedEra} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;


