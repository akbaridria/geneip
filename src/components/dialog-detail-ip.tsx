import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useIpGraphStore } from "@/store";
import ImageSection from "./dialog-detail-ip/image-section";
import DetailAsset from "./dialog-detail-ip/detail-asset";
import BidsHistory from "./dialog-detail-ip/bids-history";
import ActivityHistory from "./dialog-detail-ip/activity-history";
import useDetailAsset from "./dialog-detail-ip/use-detail-asset";

const DialogDetailIP = () => {
  const { isOpenDialogDetailIP, selectedAssetId, setIsOpenDialogDetailIP } =
    useIpGraphStore();
  const { isOwner, metadata } = useDetailAsset(selectedAssetId || "");

  return (
    <Dialog open={isOpenDialogDetailIP} onOpenChange={setIsOpenDialogDetailIP}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto bg-sidebar border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {metadata?.name || "N/A"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          <ImageSection />
          <div className="lg:col-span-2">
            <Tabs
              defaultValue={isOwner ? "bids" : "details"}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="bids" className="relative">
                  Bids
                </TabsTrigger>
                <TabsTrigger value="activity" className="relative">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                <DetailAsset />
              </TabsContent>

              <TabsContent value="bids" className="mt-6">
                <BidsHistory />
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <ActivityHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailIP;
