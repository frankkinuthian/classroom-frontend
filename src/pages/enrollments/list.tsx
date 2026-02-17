import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";

import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EnrollmentListItem = {
  id: number;
  classId: number;
  studentId: string;
  class?: {
    id: number;
    name: string;
    status?: "active" | "inactive" | "archived" | null;
  } | null;
  subject?: {
    id: number;
    name: string;
    code: string;
  } | null;
  createdAt: string;
};

type ClassOption = {
  id: number;
  name: string;
};

const EnrollmentsList = () => {
  const [searchStudentId, setSearchStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("all");

  const { query: classesQuery } = useList<ClassOption>({
    resource: "classes",
    pagination: { pageSize: 100 },
  });

  const classOptions = classesQuery.data?.data ?? [];

  const filters = [
    ...(selectedClassId === "all"
      ? []
      : [
          {
            field: "classId",
            operator: "eq" as const,
            value: Number(selectedClassId),
          },
        ]),
    ...(searchStudentId
      ? [
          {
            field: "studentId",
            operator: "eq" as const,
            value: searchStudentId.trim(),
          },
        ]
      : []),
  ];

  const columns = useMemo<ColumnDef<EnrollmentListItem>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 90,
        header: () => <p className="column-title ml-2">ID</p>,
        cell: ({ getValue }) => <Badge>{getValue<number>()}</Badge>,
      },
      {
        id: "class",
        accessorKey: "class.name",
        size: 240,
        header: () => <p className="column-title">Class</p>,
        cell: ({ row }) => (
          <span>{row.original.class?.name ?? `Class #${row.original.classId}`}</span>
        ),
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 200,
        header: () => <p className="column-title">Subject</p>,
      },
      {
        id: "studentId",
        accessorKey: "studentId",
        size: 260,
        header: () => <p className="column-title">Student ID</p>,
      },
      {
        id: "status",
        accessorKey: "class.status",
        size: 130,
        header: () => <p className="column-title">Class Status</p>,
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
            resource="enrollments"
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

  const enrollmentsTable = useTable<EnrollmentListItem>({
    columns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: filters,
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p>Track student enrollment records across classes.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Filter by student ID..."
              className="pl-10 w-full"
              value={searchStudentId}
              onChange={(event) => setSearchStudentId(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="enrollments" />
          </div>
        </div>
      </div>

      <DataTable table={enrollmentsTable} />
    </ListView>
  );
};

export default EnrollmentsList;
