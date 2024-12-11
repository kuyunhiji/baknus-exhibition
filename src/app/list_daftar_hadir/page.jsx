'use client'

import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa";

const Page = () => {
    const [daftarHadir, setDaftarHadir] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [idDelete, setIdDelete] = useState(0)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleFecth = async () => {
            try {
                if (search == '') {
                    const response = await fetch("/api/daftar_hadir", {
                        method: 'GET',
                        cache: 'no-store'
                    })
                    const data = await response.json()
                    setDaftarHadir(data)
                    setLoading(false)
                    console.log(data)
                } else {
                    const response = await fetch(`/api/daftar_hadir?search=${search}`, {
                        method: 'GET',
                        cache: 'no-store'
                    })
                    const data = await response.json()
                    if (response.status == 200) {
                        setDaftarHadir(data)
                        setLoading(false)
                    } else {
                        setDaftarHadir({data: []})
                        setLoading(false)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        handleFecth()
    }, [search])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/daftar_hadir?id=${id}`, {
                method: 'DELETE',
            })
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const downloadExcel = async () => {
        const response = await fetch('/api/dowload_exel');
        const blob = await response.blob();
    
        // Membuat link unduhan
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DaftarHadir.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    
    

    return (
        <div className="w-full flex justify-center" >
            <div className={`w-full h-screen bg-black/50 ${showModalDelete ? 'flex' : 'hidden'} justify-center items-center fixed top-0 left-0`} >
                <div className="px-11 py-5 bg-white shadow-lg rounded-lg" >
                    <h1 className="text-2xl text-center" >Apakah yakin?</h1>
                    <div className="mt-3 flex justify-center gap-x-7" >
                        <button onClick={() => setShowModalDelete(false)} className="w-20 py-1 bg-red-500 rounded-lg text-white" >Tidak</button>
                        <button onClick={() => handleDelete(idDelete)} className="w-20 py-1 bg-blue-500 rounded-lg text-white">Ya</button>
                    </div>
                </div>
            </div>
            <div className="w-3/4 mt-20" >
                <div className="flex justify-between items-center " >
                <div className="flex items-center gap-x-3" >
                    <FaArrowLeft onClick={() => router.push("/")} className="text-2xl cursor-pointer" />
                    <h1 className="text-4xl">Daftar Hadir</h1>
                </div>
                    <div className="flex items-center gap-x-3">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="p-1 border-2 border-black/70 rounded-lg" type="text" placeholder="Pencarian..." />
                        <button className="px-3 py-1 bg-primary rounded-lg" onClick={downloadExcel}>Unduh ke Excel</button>;
                    </div>
                </div>
                <div className="overflow-x-auto mt-3">
                    <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">No</th>
                                <th className="border border-gray-300 px-4 py-2">Nama</th>
                                <th className="border border-gray-300 px-4 py-2">Kelas</th>
                                <th className="border border-gray-300 px-4 py-2">Asal Sekolah</th>
                                <th className="border border-gray-300 px-4 py-2">Alamat</th>
                                <th className="border border-gray-300 px-4 py-2">Foto</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading || daftarHadir.data.length == 0
                                ? null
                                : daftarHadir.data.map((data, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{data.nama}</td>
                                            <td className="border border-gray-300 px-4 py-2">{data.kelas}</td>
                                            <td className="border border-gray-300 px-4 py-2">{data.asal_sekolah}</td>
                                            <td className="border border-gray-300 px-4 py-2">{data.alamat}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <Image src={data.foto_selfie} alt={`foto selfie ${data.nama}`} width={40} height={40} />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2"><button onClick={() => {
                                                setIdDelete(data.id)
                                                setShowModalDelete(true)
                                            }} >delete</button></td>
                                        </tr>
                                    )
                                }) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page