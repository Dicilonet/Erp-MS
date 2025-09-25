
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { differenceInDays, parseISO } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task, TaskStatus } from "@/lib/types";
import { db } from '@/lib/firebase';

const taskStatusColors: { [key in TaskStatus]: string } = {
    'Pendiente': 'hsl(var(--chart-5))',
    'En Progreso': 'hsl(var(--chart-4))',
    'Bloqueado': 'hsl(var(--chart-1))',
    'Completado': 'hsl(var(--chart-2))'
};

interface GanttChartData {
  taskName: string;
  range: [number, number];
  status: TaskStatus;
  ganttBar: number[];
  fill: string;
  assignee: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + data.ganttBar[0]);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + data.ganttBar[1]);

    const duration = differenceInDays(endDate, startDate);

    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 border rounded-lg shadow-lg">
        <p className="font-bold">{`${label}`}</p>
        <p className="text-sm text-muted-foreground">{`Asignado a: ${data.assignee}`}</p>
        <p className="text-sm">{`Duración: ${duration <= 0 ? 1 : duration} día(s)`}</p>
        <p className="text-sm flex items-center">
            Estado: <span className="w-3 h-3 rounded-full inline-block ml-2" style={{ backgroundColor: data.fill }}></span>
            <span className='ml-1'>{data.status}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface GanttChartProps {
    selectedProjectId: string | null;
}

export function GanttChart({ selectedProjectId }: GanttChartProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<GanttChartData[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      setChartData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "tasks"), where("projectId", "==", selectedProjectId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), taskId: doc.id })) as Task[];
        setTasks(tasksData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching tasks for Gantt: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedProjectId]);

  useEffect(() => {
    if (tasks.length > 0) {
        const today = new Date();
        today.setHours(0,0,0,0);

        const processedData = tasks.map(task => {
            const startDate = parseISO(task.createdAt);
            const endDate = parseISO(task.dueDate);
            
            const startDay = Math.max(0, differenceInDays(startDate, today));
            const endDay = differenceInDays(endDate, startDate);

            return {
                taskName: task.taskName,
                range: [startDay, endDay],
                status: task.status,
                assignee: task.assignedTo,
                ganttBar: [startDay, endDay < 0 ? 0 : endDay],
                fill: taskStatusColors[task.status] || '#cccccc',
            };
        }).sort((a,b) => a.range[0] - b.range[0]);

        setChartData(processedData);
    } else {
        setChartData([]);
    }
  }, [tasks]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cronograma del Proyecto (Vista Gantt)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[26rem]">
            {loading ? (
                <Skeleton className="w-full h-full" />
            ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                        {selectedProjectId ? "No hay tareas para mostrar en el cronograma." : "Selecciona un proyecto para ver su cronograma."}
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        barCategoryGap="35%"
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={['dataMin', 'dataMax + 2']} name="Días desde hoy"/>
                        <YAxis dataKey="taskName" type="category" width={isMobile ? 80 : 120} tick={{fontSize: isMobile ? 10 : 12}}/>
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsla(var(--accent) / 0.2)'}}/>
                        <Bar dataKey="ganttBar" stackId="a" radius={[4, 4, 4, 4]}>
                            {chartData.map((entry, index) => (
                                <Bar key={`cell-${index}`} fill={index % 2 === 0 ? 'transparent' : entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
