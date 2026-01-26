import { describe, it, expect } from "vitest";
import { PLAN_LIMITS } from "./index";

describe("Plan Limits Configuration", () => {
  const plans = ["free", "starter", "pro", "enterprise"];

  describe("PLAN_LIMITS structure", () => {
    it("should have all required plans", () => {
      for (const plan of plans) {
        expect(PLAN_LIMITS[plan]).toBeDefined();
      }
    });

    it("should have all required fields for each plan", () => {
      const requiredFields = [
        "dailyThreads",
        "hooksPerGeneration",
        "historyDays",
        "dailyCostLimit",
        "monthlyCostLimit",
      ];

      for (const plan of plans) {
        for (const field of requiredFields) {
          expect(PLAN_LIMITS[plan]).toHaveProperty(field);
        }
      }
    });
  });

  describe("Plan hierarchy", () => {
    it("should have increasing daily threads for higher plans", () => {
      expect(PLAN_LIMITS.free.dailyThreads).toBeLessThan(PLAN_LIMITS.starter.dailyThreads);
      expect(PLAN_LIMITS.starter.dailyThreads).toBeLessThan(PLAN_LIMITS.pro.dailyThreads);
      expect(PLAN_LIMITS.pro.dailyThreads).toBeLessThan(PLAN_LIMITS.enterprise.dailyThreads);
    });

    it("should have increasing history days for higher plans", () => {
      expect(PLAN_LIMITS.free.historyDays).toBeLessThan(PLAN_LIMITS.starter.historyDays);
      expect(PLAN_LIMITS.starter.historyDays).toBeLessThan(PLAN_LIMITS.pro.historyDays);
      expect(PLAN_LIMITS.pro.historyDays).toBeLessThan(PLAN_LIMITS.enterprise.historyDays);
    });

    it("should have increasing daily cost limits for higher plans", () => {
      expect(PLAN_LIMITS.free.dailyCostLimit).toBeLessThan(PLAN_LIMITS.starter.dailyCostLimit);
      expect(PLAN_LIMITS.starter.dailyCostLimit).toBeLessThan(PLAN_LIMITS.pro.dailyCostLimit);
      expect(PLAN_LIMITS.pro.dailyCostLimit).toBeLessThan(PLAN_LIMITS.enterprise.dailyCostLimit);
    });

    it("should have increasing monthly cost limits for higher plans", () => {
      expect(PLAN_LIMITS.free.monthlyCostLimit).toBeLessThan(PLAN_LIMITS.starter.monthlyCostLimit);
      expect(PLAN_LIMITS.starter.monthlyCostLimit).toBeLessThan(PLAN_LIMITS.pro.monthlyCostLimit);
      expect(PLAN_LIMITS.pro.monthlyCostLimit).toBeLessThan(PLAN_LIMITS.enterprise.monthlyCostLimit);
    });
  });

  describe("Cost limits sanity checks", () => {
    it("should have positive cost limits", () => {
      for (const plan of plans) {
        expect(PLAN_LIMITS[plan].dailyCostLimit).toBeGreaterThan(0);
        expect(PLAN_LIMITS[plan].monthlyCostLimit).toBeGreaterThan(0);
      }
    });

    it("should have monthly limit greater than daily limit", () => {
      for (const plan of plans) {
        expect(PLAN_LIMITS[plan].monthlyCostLimit).toBeGreaterThan(
          PLAN_LIMITS[plan].dailyCostLimit
        );
      }
    });

    it("should have monthly limit allow for reasonable daily usage", () => {
      for (const plan of plans) {
        // Monthly limit should allow for at least 10 days of daily usage
        const minMonthly = PLAN_LIMITS[plan].dailyCostLimit * 10;
        expect(PLAN_LIMITS[plan].monthlyCostLimit).toBeGreaterThanOrEqual(minMonthly);
      }
    });

    it("should have reasonable free tier limits", () => {
      expect(PLAN_LIMITS.free.dailyCostLimit).toBeLessThanOrEqual(0.50);
      expect(PLAN_LIMITS.free.monthlyCostLimit).toBeLessThanOrEqual(5.00);
    });

    it("should have enterprise limits that support heavy usage", () => {
      expect(PLAN_LIMITS.enterprise.dailyCostLimit).toBeGreaterThanOrEqual(5.00);
      expect(PLAN_LIMITS.enterprise.monthlyCostLimit).toBeGreaterThanOrEqual(100.00);
    });
  });

  describe("Thread limits sanity checks", () => {
    it("should have positive thread limits", () => {
      for (const plan of plans) {
        expect(PLAN_LIMITS[plan].dailyThreads).toBeGreaterThan(0);
      }
    });

    it("should have free tier with minimal threads", () => {
      expect(PLAN_LIMITS.free.dailyThreads).toBeLessThanOrEqual(3);
    });

    it("should have enterprise with generous limits", () => {
      expect(PLAN_LIMITS.enterprise.dailyThreads).toBeGreaterThanOrEqual(50);
    });
  });
});
