import Head from "next/head"
import Layout, { siteTitle } from "../components/layout"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"

export default function Home() {
  const [loading, setLoading] = useState("")
  const fileRef = useRef()
  const textRef = useRef()
  const speakerRef = useRef()
  const audioRef = useRef()
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading("Loading...")
    let data = new FormData()
    if (fileRef.current && textRef.current && speakerRef.current) {
      data.append('file', fileRef.current.files[0])
      data.append('text', textRef.current.value)
      data.append('speaker', speakerRef.current.value)
      await fetch("https://27.96.130.116:16006/uploads", {
        method: 'POST',
        body: data
      }).then(response => response.json())
      .then(({ result }) => router.push(`/result/${result}`))
      .then(e=>setLoading("Page Loading...!"))
      .catch(e=>setLoading("Fetch Error"))
    } else {
      setLoading("다시 폼을 작성")
    }
  }

  const onChangeHandler = (e) => {
    const file = fileRef.current.files[0]
    const { current } = audioRef
    if (current != undefined) {
      current.src = URL.createObjectURL(file)
    }
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h1>음성 제출</h1>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <p>변환할 음성을 선택하세요 : </p>
          <input
            ref={fileRef}
            onChange={onChangeHandler}
            type='file'
            accept="audio/*"
            capture="microphone"
            name='file'
          />
          
          <audio ref={audioRef} controls></audio>
          <p>음성의 내용을 입력하세요 : </p>
          <input
            ref={textRef}
            type="text"
            name="text"
          />
          <p>원하는 목소리를 선택하세요 : </p>
          <select ref={speakerRef}>
            <option defaultValue="kss">KSS</option>
            <option value="you">유희열</option>
          </select>
          <hr />
          <button onClick={onSubmit} type="submit">제출</button>
        </form>
      </section>

      <section>
        <p>{loading}</p>
      </section>
    </Layout>
  )
}

// export const getStaticProps: GetStaticProps = async() => {
//   const data = await getAudio("1.wav")
//   return {
//     props: data
//   }
// }

// http://27.96.130.116:16006/temp.wav