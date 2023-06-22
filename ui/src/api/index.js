import axios from 'axios';

const EPISODE = 25
const BASE_URL = `http://localhost:4000`

export async function getTopLevelCategories() {
    const response = await axios.get(`${BASE_URL}/categories`);
    console.log(response);
    return response.data;
}

export async function getEpisode(id) {
  const url = `${BASE_URL}/category/${id}`;
  console.log(url);
  const response = await axios.get(url);
  return [response.data];
}

export async function setSuggestions(topic) {
  const url = `${BASE_URL}/generate-suggestions`;

  const body = {
    topic: topic
  }

  const response = await axios.post(url, body);
  return [response.data];
}

export async function postSomething(data) {
  const response = await axios.post(`${BASE_URL}/something`, data);
  return response.data;
}