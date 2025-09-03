import Link from "next/link"

const Home: React.FC = () => {
    return (
        <>
            <div>
                <Link className="btn-primary" href={'/profile'}>Go to profile</Link>
            </div>
        </>
    )
}

export default Home