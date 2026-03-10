const FILTERS = ["blur", "mono", "negate", null, null, null, null];

export const fetchCats = async (limit: number = 12): Promise<string[]> => {
  try {
    const skip = Math.floor(Math.random() * 500);
    const response = await fetch(`https://cataas.com/api/cats?limit=${limit}&skip=${skip}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error("Server response was not ok");

    const data = await response.json();

    return data
      .map((cat: any) => {
        const id = cat._id || cat.id;
        if (!id) return null;
        const filter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
        const base = `https://cataas.com/cat/${id}?width=450`;
        return filter ? `${base}&filter=${filter}` : base;
      })
      .filter((url: string | null): url is string => url !== null);
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};