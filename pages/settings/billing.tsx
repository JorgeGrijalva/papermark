import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { useTeam } from "@/context/team-context";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { UpgradeContactUsModal } from "@/components/billing/upgrade-contact-us-modal";
import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";
import AppLayout from "@/components/layouts/app";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useAnalytics } from "@/lib/analytics";
import { usePlan } from "@/lib/swr/use-billing";
import { cn } from "@/lib/utils";

const frequencies: {
  value: "monthly" | "annually";
  label: "Monthly" | "Annually";
  priceSuffix: "/month" | "/month";
}[] = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/month" },
];

export default function Billing() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { plan, isCustomer } = usePlan();
  const [clicked, setClicked] = useState<boolean>(false);
  const frequency = frequencies[1];
  const [toggleProYear, setToggleProYear] = useState<boolean>(true);
  const [toggleBusinessYear, setToggleBusinessYear] = useState<boolean>(true);
  const [toggleDataroomsYear, setToggleDataroomsYear] = useState<boolean>(true);
  const [frequencyPro, setFrequencyPro] = useState(frequencies[0]);
  const [frequencyBusiness, setFrequencyBusiness] = useState(frequencies[0]);
  const [frequencyDatarooms, setFrequencyDatarooms] = useState(frequencies[0]);
  useEffect(() => {
    if (toggleProYear) {
      setFrequencyPro(frequencies[1]);
    } else {
      setFrequencyPro(frequencies[0]);
    }

    if (toggleBusinessYear) {
      setFrequencyBusiness(frequencies[1]);
    } else {
      setFrequencyBusiness(frequencies[0]);
    }
    if (toggleDataroomsYear) {
      setFrequencyDatarooms(frequencies[1]);
    } else {
      setFrequencyDatarooms(frequencies[0]);
    }
  }, [toggleProYear, toggleBusinessYear, toggleDataroomsYear]);

  const teamInfo = useTeam();

  useEffect(() => {
    if (router.query.success) {
      toast.success("Upgrade success!");
      analytics.capture("User Upgraded", {
        plan: plan,
        teamId: teamInfo?.currentTeam?.id,
        $set: { teamId: teamInfo?.currentTeam?.id, teamPlan: plan },
      });
    }

    if (router.query.cancel) {
      analytics.capture("Stripe Checkout Cancelled", {
        teamId: teamInfo?.currentTeam?.id,
      });
    }
  }, [router.query]);

  const tiers: {
    name: string;
    id: string;
    href: string;
    currentPlan: boolean;
    price: string;
    description: string;
    featureIntro: string;
    features: string[];
    bgColor: string;
    borderColor: string;
    textColor: string;
    buttonText: string;
    mostPopular: boolean;
  }[] = [
    {
      name: "Data Rooms",
      id: "tier-datarooms",
      href: "/login",
      currentPlan: plan && plan == "datarooms" ? true : false,
      price: "Custom price",
      description:
        "The one for more control, data room, and multi-file sharing.",
      featureIntro: "What's included:",
      features: [
        "3 users included",
        "Unlimited data rooms",
        "Custom domain for data rooms",
        "Advanced data rooms analytics",
        "NDA agreements",
        "Dynamic Watermark",
        "Granular user/group permisssions",
        "Invite users directly from Papermark",
        "Audit log",
        "24h priority support",
        "Custom onboarding ",
      ],
      bgColor: "#fb7a00",
      borderColor: "#fb7a00",
      textColor: "#black",
      buttonText: "Contact Sales",
      mostPopular: true,
    },
  ];

  const enterpriseFeatures = [
    "Self-hosted version",
    "Unlimited users",
    "Unlimited documents",
    "Unlimited folders and subfolders",
    "Unlimited datarooms",
    "Full white-labeling",
    "Up to 5TB file uploads",
    "Dedicated support",
    "Custom onboarding",
  ];

  const currentTier = tiers.find((tier) => tier.currentPlan);
  if (currentTier) {
    console.log(plan);
    console.log(`El usuario tiene el tier: ${currentTier.name}`);
  } else {
    console.log("El usuario no tiene un tier activo.");
  }

  return (
    <AppLayout>
      <main className="relative mx-2 mb-10 mt-4 space-y-8 overflow-hidden px-1 sm:mx-3 md:mx-5 md:mt-5 lg:mx-7 lg:mt-8 xl:mx-10">
        <SettingsHeader />

        <div>
          <div className="mb-4 flex items-center justify-between md:mb-8 lg:mb-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                Billing
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and billing information.
                </p>
                {/* <Link
                  href="/settings/upgrade"
                  className="text-sm text-foreground underline-offset-4 hover:underline"
                >
                  See all plans
                </Link> */}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900">
            <div className="mx-auto">
              <div className="overflow-hidden rounded-xl">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex flex-col justify-between p-6 md:flex-row"
                  >
                    <div className="md:w-1/3">
                      <h3
                        id={tier.id}
                        className="mb-4 flex items-center gap-x-2 text-balance text-xl leading-8 text-foreground"
                      >
                        <span>{tier.name}</span>
                        {tier.currentPlan ? (
                          <Badge className="rounded-md">Current Plan</Badge>
                        ) : null}
                      </h3>
                      <p className="mb-4 text-balance text-sm leading-6 text-gray-600 dark:text-muted-foreground">
                        {tier.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-3xl font-semibold">
                          {tier.price}
                        </span>
                        {/* <span className="text-sm text-muted-foreground">
                          /month
                        </span> */}
                      </div>
                      {tier.id !== "tier-free" && (
                        <div>
                          {tier.currentPlan && isCustomer ? (
                            <Button
                              className="rounded-3xl"
                              loading={clicked}
                              onClick={() => {
                                setClicked(true);
                                fetch(
                                  `/api/teams/${teamInfo?.currentTeam?.id}/billing/manage`,
                                  {
                                    method: "POST",
                                  },
                                )
                                  .then(async (res) => {
                                    const url = await res.json();
                                    router.push(url);
                                  })
                                  .catch((err) => {
                                    alert(err);
                                    setClicked(false);
                                  });
                              }}
                            >
                              {clicked
                                ? "Redirecting to Customer Portal..."
                                : "Manage Subscription"}
                            </Button>
                          ) : plan !== "free" && isCustomer ? (
                            <Button
                              className="rounded-3xl"
                              variant="orange"
                              loading={clicked}
                              onClick={() => {
                                setClicked(true);
                                fetch(
                                  `/api/teams/${teamInfo?.currentTeam?.id}/billing/manage`,
                                  {
                                    method: "POST",
                                  },
                                )
                                  .then(async (res) => {
                                    const url = await res.json();
                                    router.push(url);
                                  })
                                  .catch((err) => {
                                    alert(err);
                                    setClicked(false);
                                  });
                              }}
                            >
                              {clicked
                                ? "Redirecting to Customer Portal..."
                                : tier.buttonText}
                            </Button>
                          ) : (
                            <UpgradeContactUsModal
                              clickedPlan={tier.name as "Data Rooms"}
                              trigger={"billing_page"}
                            >
                              <Button className="rounded-3xl" variant="orange">
                                {tier.buttonText}
                              </Button>
                            </UpgradeContactUsModal>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 md:mt-0 md:w-2/3">
                      <h4 className="mb-4 text-sm font-semibold">
                        {tier.featureIntro}
                      </h4>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm leading-6 text-gray-600 dark:text-muted-foreground">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-x-2"
                          >
                            <CheckIcon
                              className="h-5 w-5 flex-shrink-0 text-[#fb7a00]"
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
