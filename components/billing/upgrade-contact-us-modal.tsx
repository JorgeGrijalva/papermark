import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useMemo, useState } from "react";
import React from "react";

import { useTeam } from "@/context/team-context";
import { Building, CheckIcon, Mail, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import { useAnalytics } from "@/lib/analytics";
import { getStripe } from "@/lib/stripe/client";
import { PLANS } from "@/lib/stripe/utils";
import { usePlan } from "@/lib/swr/use-billing";
import { capitalize } from "@/lib/utils";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// import { SalesContactForm } from "./sales-contact-form";

export function UpgradeContactUsModal({
  clickedPlan,
  trigger,
  open,
  setOpen,
  children,
}: {
  clickedPlan: "Pro" | "Business" | "Data Rooms";
  trigger?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
  // const router = useRouter();
  // const [period, setPeriod] = useState<"yearly" | "monthly">("yearly");
  // const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const teamInfo = useTeam();
  // const { plan: teamPlan, trial, isCustomer, isOldAccount } = usePlan();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    toast.loading("Sending message...", { id: "sending-message" });

    try {
      const response = await fetch(
        `/api/teams/${teamInfo?.currentTeam?.id}/billing/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        toast.error("Error al enviar el formulario", {
          id: "sending-message",
        });
        return console.log("Error al enviar el formulario");
      }
      toast.success("Formulario enviado con éxito!", {
        id: "sending-message",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: "sending-message",
        });
      } else {
        toast.error("An unexpected error occurred", {
          id: "sending-message",
        });
      }
    } finally {
      setFormData({
        name: "",
        email: "",
        message: "",
        company: "",
      });
      setIsSubmitting(false);
    }
  };

  console.log(teamInfo?.currentTeam?.id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });

  const analytics = useAnalytics();

  // const planFeatures = useMemo(
  //   () => ({
  // Pro: {
  //   featureIntro: "Everything in Free, plus:",
  //   features: [
  //     "2 users included",
  //     "100 documents",
  //     "Unlimited links",
  //     "Custom branding",
  //     "Folder organization",
  //     "Require email verification",
  //     "More file types: pppt, docx, excel",
  //     "Papermark branding removed",
  //     "1-year analytics retention",
  //   ],
  // },
  // Business: {
  //   featureIntro: "Everything in Pro, plus:",
  //   features: [
  //     "3 users included",
  //     "1 dataroom",
  //     <span key="custom-dataroom">
  //       Custom domain <b>for documents</b>
  //     </span>,
  //     "Unlimited folder levels",
  //     "Unlimited documents",
  //     "Large file uploads",
  //     "Multi-file sharing",
  //     "Allow/Block list",
  //     "Dataroom branding",
  //     "More file types: dmg (cad)",
  //     "2-year analytics retention",
  //   ],
  // },
  //     "Data Rooms": {
  //       featureIntro: "Everything in Business, plus:",
  //       features: [
  //         "3 users included",
  //         "Unlimited data rooms",
  //         <span key="custom-dataroom">
  //           Custom domain <b>for data rooms</b>
  //         </span>,
  //         "Advanced data rooms analytics",
  //         "NDA agreements",
  //         "Dynamic Watermark",
  //         "Granular user/group permissions",
  //         "Invite users directly from Papermark",
  //         "Audit log",
  //         "24h priority support",
  //         "Custom onboarding ",
  //       ],
  //     },
  //   }),
  //   [],
  // );

  const plansToShow = useMemo(() => {
    switch (clickedPlan) {
      case "Pro":
        return ["Pro", "Business"];
      case "Business":
        return ["Business", "Data Rooms"];
      case "Data Rooms":
        return ["Data Rooms"];
      default:
        return ["Pro", "Business"];
    }
  }, [clickedPlan]);

  const isOnlyDataRooms = useMemo(
    () => plansToShow.length === 1 && plansToShow[0] === "Data Rooms",
    [plansToShow],
  );

  const handleUpgradeClick = () => {
    // analytics.capture("Upgrade Button Clicked", {
    //   trigger: trigger,
    //   teamId: teamInfo?.currentTeam?.id,
    // });
  };

  // useEffect(() => {
  //   if (open) {
  //     analytics.capture("Upgrade Button Clicked", {
  //       trigger: trigger,
  //       teamId: teamInfo?.currentTeam?.id,
  //     });
  //   }
  // }, [open, trigger]);

  const buttonChild = React.isValidElement<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }>(children)
    ? React.cloneElement(children, { onClick: handleUpgradeClick })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonChild}</DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto bg-gray-50 text-foreground dark:bg-gray-900"
        style={{
          width: "550px",
        }}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-center space-x-4">
            <Card className="w-full border-none bg-transparent">
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl font-bold">
                  Contact Our Sales Team
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="Acme Inc."
                        required
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="min-h-[100px] pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 font-semibold text-white hover:bg-orange-500/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
