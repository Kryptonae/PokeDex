function Footer() {
    return (
        <footer className="bg-none py-6" id="about">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Pokémon Explorer. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer;