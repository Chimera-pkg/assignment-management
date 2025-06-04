"use client";

import AssignmentForm from "@/components/kumpulin";
// import AssignmentUploadForm from "@/components/kumpulin";
import { Card } from "@/components/ui/card";

const AssignmentsPage = () => {
  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <Card>
          <AssignmentForm />
        </Card>
      </div>
    </div>
  );
};

export default AssignmentsPage;