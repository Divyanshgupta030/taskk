import { getTaskDetails } from "@/actions/getTaskDetails";
import { ProjectHeader } from "@/app/components/ProjectHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarCheck, CircleCheck, CircleDot, Flag, Loader2, LoaderIcon, LoaderPinwheel, Plus, UserPlus } from "lucide-react";
import { FcCancel } from "react-icons/fc";
import { RxLapTimer } from "react-icons/rx";
import { LiaTagSolid } from "react-icons/lia";
import { getRandomColor } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuBarChartBig } from "react-icons/lu";
import { LuTable } from "react-icons/lu";
import SearchBar from "@/app/components/SearchBar";
import FilterButton from "@/app/components/FilterButton";
import AddColumn from "@/app/components/AddColumn";
import SingleList from "@/app/components/SingleList";
import Boards from "@/app/components/Boards";
import TableList from "@/app/components/TableList";
import Calender from "@/app/components/Calender";
import { TaskColor, TaskProps, Todo } from "@/lib/types";
import Main from "./_components/main";
import AddMember from "./_components/addMember";


export default async function TaskPage({
  params,
  searchParams,
}: {
  params: { taskId: string };
  searchParams: { [search: string]: string | undefined };
}) {
  console.log(searchParams.search);
  const task = await getTaskDetails(params.taskId, searchParams.search);
  if (!task) {
    return <div>Task not found</div>;
  }
  const tasks: TaskColor[] = task.columns
    .map((column) => {
      const color = column.color;
      return column.todos.map((task: any) => {
        return {
          ...task,
          color: color,
        };
      });
    })
    .flat(1);

  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 h-screen rounded-l-3xl backdrop-blur-sm border-muted-foreground/20 overflow-scroll mt-2 bg-[#0F1011]">
      <div>
        <div className="flex flex-col gap-1 relative bg-[#0F1011]">
          <ProjectHeader name={task.name} />
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
          <div className="flex flex-row justify-between">
            <h1 className="text-4xl font-normal text-neutral-300 px-6">
              {task.name}
            </h1>
            <Button className="  rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none  focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10 hover:bg-neutral-800/20 hover:shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] mx-4 flex flex-row items-center gap-x-1">
              <UserPlus size={16} />
              Invites
            </Button>
          </div>
          <div className="px-4 flex flex-col gap-y-4">
            <div className="flex flex-row items-center gap-x-1 gap-y-1">
              <Flag size={16} className="text-neutral-500" />
              <span className="text-neutral-500">Priority:</span>
              <Badge className="text-xs  bg-sky-500/40 text-sky-500 ring-1/[0.5] ring-white mx-2">
                {task.priority}
              </Badge>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <UserPlus size={16} className="text-neutral-500" />
              <span className="text-neutral-500">Team:</span>
              {task.boardMembers.map((mem, index) => (
                <Badge
                  key={index}
                  className="text-xs  bg-white ring-1/[0.5] ring-white mx-2 flex flex-row items-center gap-x-1"
                >
                  <div>
                    {mem.user.profileImage && <img src={mem.user.profileImage} className="w-4 h-4 rounded-full" />}
                  </div>
                 {mem.user.name}
                </Badge>
              ))}
              <AddMember id={task.id} />
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <CalendarCheck size={16} className="text-neutral-500" />
              <span className="text-neutral-500">Due Date:</span>
              <span className="text-white text-sm font-mono">
                {format(new Date(), "dd MMMM yyyy")}
              </span>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <LoaderIcon size={16} className="text-neutral-500" />
              <span className="text-neutral-500">Status:</span>
              <Badge
                className={cn(
                  "text-xs  mx-2 flex flex-row items-center gap-x-1 shadow-md",
                  {
                    "bg-emerald-500/40 text-emerald-500":
                      task.status === "done",
                    "bg-red-500/40 text-red-500": task.status === "canceled",
                    "bg-sky-500/40 text-sky-500": task.status === "in progress",
                  }
                )}
              >
                {task.status === "in progress" || task.status === "ongoing" ? (
                  <RxLapTimer />
                ) : task.status === "done" ? (
                  <CircleCheck size={16} />
                ) : task.status === "canceled" ? (
                  <FcCancel />
                ) : (
                  <CircleDot />
                )}
                {task.status}
              </Badge>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <LiaTagSolid className="text-neutral-500" size={16} />
              <span className="text-neutral-500">Tags:</span>
              {task.tags.map((t, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-xs border border-neutral-700/[0.3]  ",
                    t.tag.color
                  )}
                >
                  {t.tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <Main columns={task.columns} boardId={task.id} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}