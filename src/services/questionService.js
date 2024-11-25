const QUESTIONS_URL = 'https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/-OCZ9vgJBL6bGDGH5rpB.json';

export const fetchQuestions = async () => {
  try {
    const response = await fetch(QUESTIONS_URL);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const data = await response.json();
    
    // Transform Firebase data to array with proper structure
    const questionsArray = Object.entries(data).map(([id, question], index) => ({
      ...question,
      id,
      packageId: Math.ceil((index + 1) / 50),
      orderNumber: (index + 1) % 50 || 50
    }));

    return questionsArray;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
