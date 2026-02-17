import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { ShowButton } from "@/components/refine-ui/buttons/show";

type DepartmentListItem = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  totalSubjects?: number;
};

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const columns = useMemo<ColumnDef<DepartmentListItem>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 120,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "subjects",
        accessorKey: "totalSubjects",
        size: 150,
        header: () => <p className="column-title">Subjects</p>,
        cell: ({ getValue }) => <span>{getValue<number>() ?? 0}</span>,
      },
      {
        id: "description",
        accessorKey: "description",
        size: 320,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">
            {getValue<string>() || "No description"}
          </span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="departments"
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

  const departmentsTable = useTable<DepartmentListItem>({
    columns,
    refineCoreProps: {
      resource: "departments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: searchFilters,
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>

      <div className="intro-row">
        <p>Manage academic departments, subjects, and linked classes.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by department name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <CreateButton resource="departments" />
        </div>
      </div>

      <DataTable table={departmentsTable} />
    </ListView>
  );
};

export default DepartmentsList;
