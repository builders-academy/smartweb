import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Loading = () => {
  return (
    <Alert className="flex h-[90vh] items-center justify-center flex-col">
      <Loader2 className="h-4 w-4 animate-spin" />
      <AlertTitle>Please wait</AlertTitle>
      <AlertDescription>Loading...</AlertDescription>
    </Alert>
  );
};

export default Loading;
