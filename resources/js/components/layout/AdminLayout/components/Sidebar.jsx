import Sider from "antd/lib/layout/Sider";
import { useContext } from 'react'
import { AdminLayoutContext } from "../AdminLayout";
import SidebarMenu from "./SidebarMenu";

export default function () {
    const { collapsed, setCollapsed, broken, setBroken } = useContext(AdminLayoutContext)

    return (
        <Sider
            breakpoint="md"
            collapsedWidth={broken ? 0 : 60}
            className='overflow-auto h-screen sticky top-0'
            collapsible
            collapsed={collapsed}
            onBreakpoint={broken => setBroken(broken)}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
            trigger={null}
        >
            <div className='flex justify-center items-center p-4 mb-8 overflow-hidden'>
                <img className='rounded mr-2' src='/images/logo.png' width={32} />
                {!collapsed &&
                    <span
                        className='text-base uppercase inline-block font-bold text-transparent text-ellipsis whitespace-nowrap bg-clip-text'
                        style={{
                            backgroundImage: '-webkit-gradient(linear,37.219838% 34.532506%,36.425669% 93.178216%,from(#29cdff),to(#0a60ff),color-stop(.37,#148eff))',
                            textFillColor: 'transparent'
                        }}
                    >Alspace Admin</span>
                }
            </div>

            <SidebarMenu />

        </Sider>
    )
}