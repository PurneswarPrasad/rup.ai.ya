import React, { useState, useEffect } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {
    target: ".month-selector",
    content: "Select different months to view your financial data",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".user-profile",
    content: "View your financial profile and key metrics",
    placement: "right",
  },
  {
    target: ".financial-overview",
    content: "Get a quick overview of your monthly income, expenses, and savings",
    placement: "left",
  },
  {
    target: ".savings-chart",
    content: "Track your savings progress over time",
    placement: "top",
  },
  {
    target: ".investments-grid",
    content: "Manage and monitor your investment portfolio",
    placement: "top",
  },
  {
    target: ".add-transaction",
    content: "Add new income or expenses here",
    placement: "bottom",
  },
];

export const AppTour = () => {
  const [runTour, setRunTour] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenTour = sessionStorage.getItem("hasSeenTour");

    if (!hasSeenTour) {
      const interval = setInterval(() => {
        const firstStepElement = document.querySelector(".month-selector");
        if (firstStepElement) {
          setRunTour(true);
          sessionStorage.setItem("hasSeenTour", "true");
          clearInterval(interval);
        }
      }, 100);

      const timeout = setTimeout(() => clearInterval(interval), 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (["finished", "skipped"].includes(status)) {
      setRunTour(false);
      toast({
        title: "Tour completed",
        description: "You can restart the tour anytime from the settings menu",
      });
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          zIndex: 1000,
          arrowColor: "hsl(var(--background))",
          backgroundColor: "hsl(var(--background))",
          overlayColor: "rgba(0, 0, 0, 0.4)",
          textColor: "hsl(var(--foreground))",
          width: 350,
        },
        tooltip: {
          backgroundColor: "hsl(var(--background))",
          borderRadius: "12px",
          border: "1px solid hsl(var(--border))",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          color: "hsl(var(--foreground))",
          fontSize: "14px",
          padding: "20px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipTitle: {
          color: "hsl(var(--foreground))",
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "8px",
        },
        tooltipContent: {
          color: "hsl(var(--muted-foreground))",
          lineHeight: "1.5",
          marginBottom: "16px",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          border: "none",
          borderRadius: "8px",
          color: "hsl(var(--primary-foreground))",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        },
        buttonBack: {
          backgroundColor: "transparent",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          color: "hsl(var(--foreground))",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          marginRight: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        },
        buttonSkip: {
          backgroundColor: "transparent",
          border: "none",
          color: "hsl(var(--muted-foreground))",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        },
        buttonClose: {
          backgroundColor: "transparent",
          border: "none",
          color: "hsl(var(--muted-foreground))",
          fontSize: "16px",
          fontWeight: "400",
          padding: "4px",
          cursor: "pointer",
          position: "absolute",
          right: "12px",
          top: "12px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        spotlight: {
          borderRadius: "8px",
        },
        progress: {
          backgroundColor: "hsl(var(--muted))",
          borderRadius: "4px",
          height: "4px",
          marginBottom: "16px",
        },
        progressBar: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: "4px",
          height: "100%",
        },
      }}
      callback={handleJoyrideCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
    />
  );
};
