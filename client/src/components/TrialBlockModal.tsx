import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TrialBlockModalProps {
  open: boolean;
}

export function TrialBlockModal({ open }: TrialBlockModalProps) {
  const [, navigate] = useLocation();

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#0f1e35]">
            Você já usou seu diagnóstico gratuito
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-slate-600 leading-relaxed">
          Seu plano gratuito inclui <strong>1 diagnóstico</strong>. Para gerar
          diagnósticos ilimitados para seus clientes e desbloquear o relatório
          em PDF com a sua marca, escolha um de nossos planos.
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/inicio")}
          >
            Voltar ao início
          </Button>
          <Button
            className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea6a0a] text-white"
            onClick={() => navigate("/planos")}
          >
            Ver planos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
