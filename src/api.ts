export const fetchCats = async (limit: number = 15): Promise<string[]> => {
  try {
    const response = await fetch(`https://cataas.com/api/cats?limit=${limit}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    return data
      .map((cat: any) => `https://cataas.com/cat/${cat._id || cat.id}`)
      .filter(Boolean);
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};