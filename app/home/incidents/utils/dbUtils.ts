import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const fetchAccountEmail = async () => {
  try {
    const { data: session, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }

    return session.session?.user.email || null;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
};

export const fetchAccountRole = async () => {
  try {
    const email = await fetchAccountEmail();

    const { data } = await supabase
      .from('account')
      .select('role')
      .eq('email', email)
      .single();

    return data?.role || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const fetchOrganizationAccountId = async () => {
  try {
    const email = await fetchAccountEmail();
    const { data } = await supabase
      .from('account')
      .select('organization_id')
      .eq('email', email)
      .single();

    return data?.organization_id || null;
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    return null;
  }
};

export const fetchOrganizationAddresses = async () => {
  try {
    const id = await fetchOrganizationAccountId();
    const { data } = await supabase
      .from('address')
      .select('street')
      .eq('organization_id', id);
    console.log(data);
    
    return data || null;
  } catch (error) {
    console.error('Error fetching organization addresses:', error);
    return null;
  }
};