
async function signUp(formData: FormData): Promise<any> {
  "use server";
  const rawFormData = {
    id: formData.get("id"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  console.log(rawFormData);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  };

  const res = await fetch(`http://localhost:3001/auth/signup`, requestOptions);

  if (!res.ok) {
    throw new Error("fail fetch data");
  }
  else console.log("회원가입 성공");
  //로그인 페이지로 리디렉션 로직 추가 요망
  return res.json();
}

async function IdCheck(formData: FormData): Promise<any> {
  "use server";
  const rawFormData = {
    id: formData.get("id"),
  };

  console.log(rawFormData);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  };

  const res = await fetch(`http://localhost:3001/auth/idvalidcheck`, requestOptions);

  if (!res.ok) {
    throw new Error("fail fetch data");
  }

  const data = await res.json();
  // 사용자가 존재하는 경우
  if (data) {
    console.log("동일한 아이디가 존재합니다.");
  } else { // 사용자가 존재하지 않는 경우
    console.log("사용가능한 아이디입니다.");
  }
}

export default async function Page() {
  return (
    <div>
      <div>
        <div>ComoStation</div>
        <div>
          <form action={signUp}>
            <div>
              <input
                type="text"
                id="id"
                name="id"
                placeholder="사용할 아이디"
              />
              <button
                  id="idDupCheck"
                  formAction={IdCheck}>
                  Check for duplication
                </button>
            </div>
            <div>
              <input
                type="name"
                id="name"
                name="name"
                placeholder="사용할 이름"
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호"
              />
            </div>
            <div>
              <input
                type="password"
                id="pwCheck"
                name="pwCheck"
                placeholder="비밀번호 확인"
              />
            </div>
            <div>
              <button
                id="signUp"
                type="submit">
                Sign up
              </button>
            </div>
          </form>
          </div>
        </div>
    </div>
  );
}
