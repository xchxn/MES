import styles from "./testpage.module.css";

async function example(formData: any):Promise<any> {
  "use server";
  const rawFormData = {
    testValue1: formData.get("testValue1"),
    testValue2: formData.get("testValue2"),
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rawFormData),
    next: { revalidate: 3600 },
  };

  const res = await fetch(`http://localhost:3001/management/managementview`, requestOptions);

  if (!res.ok) {
    throw new Error("fail fetch data");
  }
  return res.json();
}

export default function Page() { 
  return (
    <div className={styles.body}>
      <p>테스트 페이지</p>
      <p>서버 컴포넌트에서 폼데이터를 사용하여 테스트값들을 넘기는 테스트</p>
      <form action={example}>
          <div>
            <input type="text" id="testValue1" name="testValue1" placeholder="@testValue1"
            />
          </div>
          <div>
            <input type="text" id="testValue2" name="testValue2" placeholder="@testValue2"
            />
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </form>
    </div>
  );
}
