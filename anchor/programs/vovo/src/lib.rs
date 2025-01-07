use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
mod Voting {
    use super::*;

    pub fn initializePoll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        start: u64,
        end: u64,
        desc: String,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.start = start;
        poll.end = end;
        poll.desc = desc;
        poll.poll_id = poll_id;
        poll.cadidate_amount = 0;
        Ok(())
    }

    pub fn initCadidate(
        ctx: Context<InitializeCadidate>,
        name: String,
        // poll_id: u64,
    ) -> Result<()> {
        let cadidate = &mut ctx.accounts.cadidate;
        let poll = &mut ctx.accounts.poll;
        poll.cadidate_amount += 1;
        cadidate.name = name;
        cadidate.votes = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _name: String, _poll_id: u64) -> Result<()> {
        let cadidate = &mut ctx.accounts.cadidate;
        cadidate.votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64, cadidate_name: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), cadidate_name.as_ref()],
        bump)]
    pub cadidate: Account<'info, Cadidate>,
}

#[derive(Accounts)]
#[instruction(cadidate_name: String, poll_id: u64)]
pub struct InitializeCadidate<'info> {
    #[account(init, payer = signer, space = 8 + Cadidate::INIT_SPACE, seeds = [poll_id.to_le_bytes().as_ref(), cadidate_name.as_ref()], bump)]
    pub cadidate: Account<'info, Cadidate>,
    #[account(seeds = [poll_id.to_le_bytes().as_ref()], bump)]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(init, payer = signer, space = 8 + Poll::INIT_SPACE, seeds = [poll_id.to_le_bytes().as_ref()], bump)]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(20)]
    pub desc: String,
    pub start: u64,
    pub end: u64,
    pub cadidate_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Cadidate {
    #[max_len(10)]
    pub name: String,
    pub votes: u64,
}