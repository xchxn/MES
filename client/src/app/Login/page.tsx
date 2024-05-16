'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

async function Login(formData: any) {
  const rawFormData = {
    id: formData.get('id'),
    password: formData.get('password'),
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rawFormData),
  };

  const res = await fetch('http://localhost:3001/auth/login', requestOptions);
  const data = await res.json();
  console.log(data);
  Cookies.set('id', data.id);
  Cookies.set('token', data.token);
  // 사용자가 존재하는 경우
  if (data) {
    // 토큰 정보 저장
    console.log('로그인 성공.');
    window.alert("로그인 성공, 홈으로 돌아갑니다.");
    return true;
  } else {
    // 사용자가 존재하지 않는 경우
    console.log('로그인 실패.');
    return false;
  }
}

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const success = await Login(new FormData(e.target));
    if (success) {
      router.push('/');
    }
  };

  return (
    <div>
      <div>SPM</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="@ID"
              value={formData.id}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="@PASSWORD"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">
              Login
            </button>
            <button type="button">
              <Link href="/SignUp">Sign Up</Link>
            </button>
          </div>
          <div>
            If you dont have an id, sign up
          </div>
        </form>
      </div>
    </div>
  );
}
