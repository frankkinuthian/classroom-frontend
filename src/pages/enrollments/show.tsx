import { useShow } from "@refinedev/core";
import { useParams } from "react-router";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EnrollmentDetails = {
  id: number;
  classId: number;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: number;
    name: string;
    status?: string | null;
    capacity?: number | null;
  } | null;
  subject?: {
    id: number;
    name: string;
    code: string;
  } | null;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
  } | null;
};

const EnrollmentsShow = () => {
  const { id } = useParams();
  const isIdValid = Boolean(id);

  const { query } = useShow<EnrollmentDetails>({
    resource: "enrollments",
    queryOptions: {
      enabled: isIdValid,
    },
  });

  const details = query.data?.data;

  if (!isIdValid) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="enrollments" title="Enrollment Details" />
        <p className="text-sm text-muted-foreground">Invalid enrollment ID.</p>
      </ShowView>
    );
  }

  if (query.isLoading || query.isError || !details) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="enrollments" title="Enrollment Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading enrollment details..."
            : query.isError
            ? "Failed to load enrollment details."
            : "Enrollment details not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader
        resource="enrollments"
        title={`Enrollment #${details.id}`}
      />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrollment Overview</CardTitle>
          <Badge>ID: {details.id}</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-semibold">Student ID:</span> {details.studentId}
          </p>
          <p>
            <span className="font-semibold">Class:</span>{" "}
            {details.class?.name ?? `Class #${details.classId}`}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {details.class?.status ?? "unknown"}
          </p>
          <p>
            <span className="font-semibold">Capacity:</span>{" "}
            {details.class?.capacity ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(details.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Academic Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-semibold">Subject:</span>{" "}
            {details.subject
              ? `${details.subject.name} (${details.subject.code})`
              : "Not available"}
          </p>
          <p>
            <span className="font-semibold">Department:</span>{" "}
            {details.department
              ? `${details.department.name} (${details.department.code})`
              : "Not available"}
          </p>
          <p>
            <span className="font-semibold">Teacher:</span>{" "}
            {details.teacher
              ? `${details.teacher.name}${details.teacher.email ? ` (${details.teacher.email})` : ""}`
              : "Not assigned"}
          </p>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default EnrollmentsShow;
