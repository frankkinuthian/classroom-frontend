import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { enrollmentSchema } from "@/lib/schema";
import { User } from "@/types";

type ClassOption = {
  id: number;
  name: string;
};

const EnrollmentsCreate = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(enrollmentSchema),
    refineCoreProps: {
      resource: "enrollments",
      action: "create",
    },
    defaultValues: {
      classId: undefined,
      studentId: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const { query: classesQuery } = useList<ClassOption>({
    resource: "classes",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "student",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const classes = classesQuery.data?.data || [];
  const students = studentsQuery.data?.data || [];

  const onSubmit = async (values: z.infer<typeof enrollmentSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating enrollment:", error);
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create Enrollment</h1>
      <div className="intro-row">
        <p>Enroll a student into a class.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem
                              key={classItem.id}
                              value={classItem.id.toString()}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Student <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Creating Enrollment...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Create Enrollment"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default EnrollmentsCreate;
