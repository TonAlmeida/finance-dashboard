"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet,
        SheetTrigger,
        SheetContent,
        SheetTitle
 } from "../ui/sheet";
import { DollarSignIcon, Home, LogOut, Package, PanelBottom, Users } from "lucide-react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip } from "../ui/tooltip";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {

    const pathName = usePathname().slice(1);
    const [ selected, setSelected ] = useState('');
    useEffect(() => {
        if (pathName) {
            setSelected(pathName);
        } else {
            setSelected("home");
        }
    }, [pathName]);


    function sel(event: React.MouseEvent<HTMLAnchorElement>) {
        const menuId = event.currentTarget.dataset.menuId;
        if (menuId) {
            setSelected(menuId);
        }
    }

    return (
        <div className="flex w-full flex-col bg-muted/40">
            <aside className="hidden fixed inset-y-0 left-0 z-10 w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <Link data-menu-id="home" onClick={sel} href="/" className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full">
                            <Package className="h-4 w-4" />
                            <span className="sr-only">Dashbord Avatar</span>
                        </Link>

                        <Tooltip>
                            <TooltipTrigger>
                                <Link onClick={sel} data-menu-id="home" href="/" className={`${selected === 'home' ? 'selected' : ''} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">início</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" >
                                <p className="px-3 border rounded-sm bg-white">início</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Link onClick={sel} data-menu-id="transactions" href="/transactions"className={`${selected === 'transactions' ? 'selected' : ''} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                    <DollarSignIcon className="h-5 w-5" />
                                    <span className="sr-only">lista de trnsações</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" >
                                <p className="px-3 border rounded-sm bg-white">lista de trnsações</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Link onClick={sel} data-menu-id="clients" href="/clients"className={`${selected === 'clients' ? 'selected' : ''} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground`}>
                                    <Users className="h-5 w-5" />
                                    <span className="sr-only">contrapartes</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" >
                                <p className="px-3 border rounded-sm bg-white">contrapartes</p>
                            </TooltipContent>
                        </Tooltip>

                    </TooltipProvider>
                </nav>
                <nav className="flex flex-col items-center gap-4 px-2 py-5 h-full">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild className="mt-auto flex">
                                <Link href="#" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-foreground text-red-500`}>
                                    <LogOut className="h-5 w-5 text-red-500" />
                                    <span className="sr-only">sair</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" >
                                <p className="px-3 border rounded-sm bg-white">sair</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>

            <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild >
                            <Button size="icon" variant="outline" className="sm:hidden" >
                                <PanelBottom className="h-5 w-5" />
                                <span className="sr-only">Abir/fechar menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="sm:max-w-xs">
                            <SheetTitle className="sr-only">conteúdo</SheetTitle>
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link data-menu-id="home" onClick={sel} href="/" className="ml-5 mt-5 flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-white md:text-base gap-2">
                                    <Package className="h-5 w-5 transition-all"/>
                                    <span className="sr-only">logo do projeto</span>
                                </Link>

                                <Link onClick={sel} data-menu-id="home" href="/" className={`${selected === 'home' ? 'selected' : ''} flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}>
                                    <Home className="h-5 w-5 transition-all"/>
                                    <span>início</span>
                                </Link>

                                <Link onClick={sel} data-menu-id="transactions" href="/transactions" className={`${selected === 'transactions' ? 'selected' : ''} flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}>
                                    <DollarSignIcon className="h-5 w-5 transition-all"/>
                                    <span>transações</span>
                                </Link>
                        
                                <Link onClick={sel} data-menu-id="clients" href="/clients" className={`${selected === 'clients' ? 'selected' : ''} flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}>
                                    <Users className="h-5 w-5 transition-all"/>
                                    <span>contrapartes</span>
                                </Link>

                            </nav>
                            <nav className="mt-auto mb-5 grid gap-6 text-lg font-medium">
                                <Link href='#' className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                    <LogOut className="h-5 w-5 transition-all text-red-500" />
                                    <span >logout</span>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-xl">Risoflora Finance</h1>
                </header>
            </div>
        </div>
    )
}