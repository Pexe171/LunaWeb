"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { imageSchema } from "@/lib/validators";

export default function UploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: "",
      url: "",
      tags: ""
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (data: z.infer<typeof imageSchema>) => {
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      return api.post('/gallery', { ...data, tags: tagsArray });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Imagem carregada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      form.reset();
      router.push('/');
    },
    onError: (error) => {
      toast({
        title: "Erro ao carregar imagem",
        description: error.response?.data?.message || "Ocorreu um erro.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(values: z.infer<typeof imageSchema>) {
    uploadMutation.mutate(values);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-3xl font-bold">Carregar Nova Imagem</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da imagem" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>Cole um link direto da imagem (ou Google Drive).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="ex: natureza, cidade, arte (separadas por vírgula)" {...field} />
                </FormControl>
                <FormDescription>Separe as tags por vírgula.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Carregar Imagem
          </Button>
        </form>
      </Form>
    </div>
  );
}
