import { Breadcrumb, PageHeader, Table, Tag } from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import { Link, useSearchParams } from "react-router-dom"
import { useMemo } from 'react'
import useEventsQuery from "@/js/query/queries/useEventsQuery"
import { toAntdPagination } from "@/js/utils"
import Column from "antd/lib/table/Column"
import { EnvironmentOutlined, LaptopOutlined } from "@ant-design/icons"
import DropOption from "@/js/components/DropOption"

const title = {
    'active': 'Upcoming Events',
    'cancelled': 'Cancelled Events',
    'past': 'Past Events',
    'require-approval': 'Requires Approval',
}

export const useFilter = () => {
    const [searchParams] = useSearchParams()
    const filter = useMemo(() => {
        const filter = searchParams.get('filter')
        if (Object.keys(title).includes(filter)) {
            return filter
        }
        return 'active'
    }, [searchParams.get('filter')])
    return { filter, title: title[filter] }
}

export default function EventsPage() {
    const { filter, title } = useFilter()
    const { data, isFetching } = useEventsQuery(filter)

    return (
        <>
            <PageHeader
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbItem>Events</BreadcrumbItem>
                        <BreadcrumbItem className='capitalize'>{filter}</BreadcrumbItem>
                    </Breadcrumb>
                }
                title={title}
            />

            <div className='bg-white p-6 sm:mx-6'>
                <Table
                    dataSource={data?.data}
                    pagination={toAntdPagination(data)}
                    rowKey='id'
                    loading={isFetching}
                    scroll={{ x: true }}
                    bordered
                    simple
                    expandable={{
                        expandedRowRender: (record) => record.description
                    }}
                >
                    <Column
                        title='Title'
                        dataIndex='title'
                        render={(title, record) => (
                            <Link className='link' to={`/events/${record.id}`} target='_blank'>{title}</Link>
                        )}
                    />
                    <Column title='Posted By' dataIndex={['user', 'fullname']} />
                    <Column title='Date' dataIndex='start_at' render={start_at => start_at.format('MMMM DD, yyyy')} />
                    <Column
                        title='Type'
                        dataIndex='is_online'
                        render={isOnline => (
                            isOnline
                                ? <Tag icon={<LaptopOutlined />} color='processing'>Online</Tag>
                                : <Tag icon={<EnvironmentOutlined />} color='warning'>On Site</Tag>
                        )}
                    />

                    {filter === 'require-approval' &&
                        <Column
                            title='Action'
                            key='action'
                            fixed='right'
                            render={record => (
                                <DropOption menuOptions={[
                                    { key: 'approve', label: 'Approve' },
                                    { key: 'reject', label: 'Reject', danger: true }
                                ]} />
                            )}
                        />
                    }

                </Table>
            </div>
        </>
    )
}