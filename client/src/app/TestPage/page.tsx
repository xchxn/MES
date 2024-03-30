async function example():Promise<any> {
  "use server";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify,
  };

  const res = await fetch(`{url}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("fail fetch data");
  }
  return res.json();
}

export default function Page() { 
  return (
    <div>
      테스트 페이지
    </div>
  );
}
