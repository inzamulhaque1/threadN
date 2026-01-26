declare module "google-trends-api" {
  interface TrendsOptions {
    geo?: string;
    category?: string | number;
    keyword?: string;
    startTime?: Date;
    endTime?: Date;
    hl?: string;
    timezone?: number;
    property?: string;
  }

  interface GoogleTrends {
    dailyTrends(options: TrendsOptions): Promise<string>;
    realTimeTrends(options: TrendsOptions): Promise<string>;
    relatedQueries(options: TrendsOptions): Promise<string>;
    interestOverTime(options: TrendsOptions): Promise<string>;
    interestByRegion(options: TrendsOptions): Promise<string>;
    relatedTopics(options: TrendsOptions): Promise<string>;
    autoComplete(options: { keyword: string }): Promise<string>;
  }

  const googleTrends: GoogleTrends;
  export default googleTrends;
}
