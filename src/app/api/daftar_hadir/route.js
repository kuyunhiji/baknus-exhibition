import {
    db
} from "@/libs/db/connect"
import {
    NextResponse
} from "next/server"

export const POST = async (req) => {
    const {
        foto,
        nama,
        kelas,
        sekolah,
        alamat
    } = await req.json()

    if (foto == '' || nama == '' || kelas == '' || sekolah == '' || alamat == '') {
        return NextResponse.json({
            message: `Semua input harus diisi`
        }, {
            status: 400
        });
    }
    try {
        const [rows] = await db.query(`INSERT INTO daftar_hadir (nama, kelas, asal_sekolah, alamat, foto_selfie, tanggal_hadir)
    VALUES 
    ('${nama}', '${kelas}', '${sekolah}', '${alamat}', '${foto}', NOW())
    `)

        return NextResponse.json({
            message: "mantap"
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "gagal"
        }, {
            status: 500
        })
    }
}

export const GET = async (request) => {
    const {
        searchParams
    } = new URL(request.url)
    const search = searchParams.get("search")
    if (search !== null) {
        try {
            const [rows] = await db.query(`SELECT * FROM daftar_hadir WHERE nama LIKE '%${search}%' ORDER BY tanggal_hadir`)
            
            if (rows.length == 0) {
                return NextResponse.json({
                    message: `data tidak ada`
                }, {
                    status: 404
                })
            }

            return NextResponse.json({
                message: 'data berhasil ditemukan',
                data: rows
            }, {
                status: 200
            })
        } catch (error) {
            return NextResponse.json({
                message: 'data gagal ditemukan'
            }, {
                status: 500
            })
        }
    }
    try {
        const [rows] = await db.query("SELECT * FROM daftar_hadir ORDER BY tanggal_hadir")
        if (rows.length == 0) {
            return NextResponse.json({
                message: 'data tidak ada'
            }, {
                status: 200
            })
        }

        return NextResponse.json({
            message: 'data berhasil ditemukan',
            data: rows
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: 'data gagal ditemukan'
        }, {
            status: 500
        })
    }
}

export const DELETE = async (request) => {
    const {
        searchParams
    } = new URL(request.url)
    const id = searchParams.get("id")
    try {
        const [rows] = await db.query(`DELETE FROM daftar_hadir WHERE id=${id}`)

        return NextResponse.json({message: "data berhasil di delete"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "data gagal dihapus"}, {status: 500})
    }
}