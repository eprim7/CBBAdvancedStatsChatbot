from connect_to_db import get_supabase_client
import functools


@functools.cache
def get_all_stats():
    supabase = get_supabase_client()

    response = supabase.table('CollegeBasketballStats').select('*').execute()

    if response.data:
        print(f'retrieved {len(response.data)} rows')
        return response.data
    else:
        raise ValueError("weren't able to pull data from db")
    