import { Repository } from "../types/repository";
import { TrafficData } from "../types/traffic";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchRepositories(): Promise<Repository[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/database/repositories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

export async function fetchRepositoryTraffic(
  repository: string,
  startDate?: string,
  endDate?: string
): Promise<TrafficData | null> {
  try {
    const url = new URL(
      `${API_BASE_URL}/database/repositories/traffic?name=${repository}`
    );

    if (startDate) url.searchParams.append("startDate", startDate);

    if (endDate) url.searchParams.append("endDate", endDate);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TrafficData;
    return data;
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    return null;
  }
}
