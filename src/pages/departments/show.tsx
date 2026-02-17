import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DepartmentDetails = {
  department: {
    id: number;
    code: string;
    name: string;
    description?: string | null;
  };
  totals: {
    subjects: number;
    classes: number;
    enrolledStudents: number;
  };
};

type DepartmentSubject = {
  id: number;
  name: string;
  code: string;
  description?: string | null;
};

type DepartmentClass = {
  id: number;
  name: string;
  status?: "active" | "inactive" | null;
  capacity?: number | null;
  subject?: { id: number; name: string } | null;
  teacher?: { id: string; name: string } | null;
};

type DepartmentUser = {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
};

const DepartmentsShow = () => {
  const { id } = useParams();
  const isIdValid = Boolean(id);
  const departmentId = id ?? "";

  const { query } = useShow<DepartmentDetails>({
    resource: "departments",
    queryOptions: {
      enabled: isIdValid,
    },
  });

  const details = query.data?.data;

  const subjectColumns = useMemo<ColumnDef<DepartmentSubject>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 120,
        header: () => <p className="column-title">Code</p>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Subject</p>,
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="subjects"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const classColumns = useMemo<ColumnDef<DepartmentClass>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Class</p>,
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 180,
        header: () => <p className="column-title">Subject</p>,
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status ?? "unknown"}
            </Badge>
          );
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const userColumns = useMemo<ColumnDef<DepartmentUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
      },
      {
        id: "email",
        accessorKey: "email",
        size: 260,
        header: () => <p className="column-title">Email</p>,
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const subjectsTable = useTable<DepartmentSubject>({
    columns: subjectColumns,
    refineCoreProps: {
      resource: `departments/${departmentId}/subjects`,
      queryOptions: {
        enabled: isIdValid,
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
    },
  });

  const classesTable = useTable<DepartmentClass>({
    columns: classColumns,
    refineCoreProps: {
      resource: `departments/${departmentId}/classes`,
      queryOptions: {
        enabled: isIdValid,
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
    },
  });

  const teachersTable = useTable<DepartmentUser>({
    columns: userColumns,
    refineCoreProps: {
      resource: `departments/${departmentId}/users`,
      queryOptions: {
        enabled: isIdValid,
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "teacher",
          },
        ],
      },
    },
  });

  const studentsTable = useTable<DepartmentUser>({
    columns: userColumns,
    refineCoreProps: {
      resource: `departments/${departmentId}/users`,
      queryOptions: {
        enabled: isIdValid,
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  if (!isIdValid) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="departments" title="Department Details" />
        <p className="text-sm text-muted-foreground">Invalid department ID.</p>
      </ShowView>
    );
  }

  if (query.isLoading || query.isError || !details) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="departments" title="Department Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading department details..."
            : query.isError
            ? "Failed to load department details."
            : "Department details not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader resource="departments" title={details.department.name} />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Department Overview</CardTitle>
          <Badge>{details.department.code}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {details.department.description ?? "No description provided."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Subjects: {details.totals.subjects ?? 0}
            </Badge>
            <Badge variant="secondary">
              Classes: {details.totals.classes ?? 0}
            </Badge>
            <Badge variant="secondary">
              Students: {details.totals.enrolledStudents ?? 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={subjectsTable} />
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={classesTable} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable table={teachersTable} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable table={studentsTable} />
          </CardContent>
        </Card>
      </div>
    </ShowView>
  );
};

export default DepartmentsShow;
